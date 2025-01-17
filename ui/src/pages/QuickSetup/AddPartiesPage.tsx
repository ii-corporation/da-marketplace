import React, { useState, useEffect } from 'react';

import { DablPartiesInput, PartyDetails } from '@daml/hub-react';

import DamlLedger, { useLedger } from '@daml/react';

import { Button } from 'semantic-ui-react';

import { useHistory } from 'react-router-dom';

import { storeParties, retrieveUserParties } from '../../Parties';

import QueryStreamProvider from '../../websocket/queryStream';

import { PublicDamlProvider, useStreamQueries } from '../../Main';
import { httpBaseUrl, wsBaseUrl, ledgerId, publicParty } from '../../config';

import Credentials from '../../Credentials';

import { halfSecondPromise } from '../page/utils';

import { LoadingWheel, MenuItems } from './QuickSetup';

import { Role as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Role';
import { Role as RegulatorRole } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Role';
import {
  IdentityVerificationRequest,
  Service as RegulatorService,
} from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';
import { Offer as RegulatorOffer } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';
import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';
import { makeDamlSet } from '../common';

import QuickSetupPage from './QuickSetupPage';

enum LoadingStatus {
  CREATING_ADMIN_CONTRACTS = 'Confirming Admin role....',
  WAITING_FOR_TRIGGERS = 'Waiting for auto-approve triggers to deploy. This may take up to 5 minutes....',
}

const AddPartiesPage = (props: { adminCredentials: Credentials }) => {
  const { adminCredentials } = props;
  const history = useHistory();

  const [error, setError] = useState<string>();
  const [parties, setParties] = useState<PartyDetails[]>([]);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>();

  useEffect(() => {
    const storedParties = retrieveUserParties();
    if (storedParties) {
      setParties(storedParties);
    }
  }, []);

  const uploadButton = (
    <label className="custom-file-upload button ui">
      <DablPartiesInput
        ledgerId={ledgerId}
        onError={error => setError(error)}
        onLoad={partyDetails => {
          storeParties(partyDetails);
          setParties(partyDetails);
        }}
      />
      <p>Upload {parties.length > 0 ? 'a new ' : ''}.JSON file</p>
    </label>
  );

  if (loadingStatus) {
    return (
      <QuickSetupPage>
        <LoadingWheel label={loadingStatus} />
        {loadingStatus === LoadingStatus.CREATING_ADMIN_CONTRACTS ? (
          <DamlLedger
            token={adminCredentials.token}
            party={adminCredentials.party}
            httpBaseUrl={httpBaseUrl}
            wsBaseUrl={wsBaseUrl}
          >
            <QueryStreamProvider defaultPartyToken={adminCredentials.token}>
              <AdminLedger
                adminCredentials={adminCredentials}
                onComplete={() => setLoadingStatus(LoadingStatus.WAITING_FOR_TRIGGERS)}
              />
            </QueryStreamProvider>
          </DamlLedger>
        ) : loadingStatus === LoadingStatus.WAITING_FOR_TRIGGERS ? (
          parties.map(p => (
            <PublicDamlProvider
              party={p.party}
              token={p.token}
              httpBaseUrl={httpBaseUrl}
              wsBaseUrl={wsBaseUrl}
            >
              <QueryStreamProvider defaultPartyToken={p.token}>
                <CreateVerifiedIdentity
                  party={p}
                  onComplete={() => history.push(MenuItems.SELECT_ROLES)}
                />
              </QueryStreamProvider>
            </PublicDamlProvider>
          ))
        ) : null}
      </QuickSetupPage>
    );
  }

  return (
    <QuickSetupPage className="add-parties">
      {parties.length > 0 ? (
        <div className="page-row">
          <div>
            <p className="bold">Parties</p>
            <div className="party-names uploaded">
              {parties.map(p => (
                <p className="party-name" key={p.party}>
                  {p.partyName}
                </p>
              ))}
            </div>
          </div>
          <div className="upload-parties uploaded">{uploadButton}</div>
        </div>
      ) : (
        <div className="upload-parties">
          <p className="details">
            Download the .json file from the Users tab on Daml Hub, and upload it here.
          </p>
          {uploadButton}
          <span className="login-details dark">{error}</span>
        </div>
      )}

      <Button
        className="ghost next"
        disabled={parties.length === 0}
        onClick={() => setLoadingStatus(LoadingStatus.CREATING_ADMIN_CONTRACTS)}
      >
        Next
      </Button>
    </QuickSetupPage>
  );
};

const CreateVerifiedIdentity = (props: { onComplete: () => void; party: PartyDetails }) => {
  const { onComplete, party } = props;
  const ledger = useLedger();
  const userParties = retrieveUserParties() || [];

  const { contracts: regulatorServices, loading: regulatorServicesLoading } =
    useStreamQueries(RegulatorService);

  const { contracts: verifiedIdentities, loading: verifiedIdentitiesLoading } =
    useStreamQueries(VerifiedIdentity);

  const { contracts: verifiedIdentityRequests, loading: verifiedIdentityRequestsLoading } =
    useStreamQueries(IdentityVerificationRequest);

  useEffect(() => {
    if (regulatorServicesLoading || verifiedIdentitiesLoading || verifiedIdentityRequestsLoading) {
      return;
    }

    const handleVerifiedIdentity = async () => {
      let retries = 0;

      const currentServices = regulatorServices.filter(s => s.payload.customer === party.party);

      while (retries < 3) {
        if (currentServices.length > 0) {
          await Promise.all(
            currentServices.map(async service => {
              await ledger.exercise(
                RegulatorService.RequestIdentityVerification,
                service.contractId,
                {
                  legalName: party.partyName,
                  location: '',
                  observers: [publicParty],
                }
              );
            })
          );
          break;
        } else {
          await halfSecondPromise();
          retries++;
        }
      }
    };

    if (
      !verifiedIdentities.find(id => id.payload.customer === party.party) &&
      !verifiedIdentityRequests.find(c => c.payload.customer === party.party)
    ) {
      handleVerifiedIdentity();
    }

    if (userParties.every(p => !!verifiedIdentities.find(v => v.payload.customer === p.party))) {
      return onComplete();
    }
  }, [
    ledger,
    onComplete,
    userParties,
    verifiedIdentities,
    verifiedIdentitiesLoading,
    regulatorServices,
    regulatorServicesLoading,
    verifiedIdentityRequestsLoading,
    verifiedIdentityRequests,
    party,
  ]);

  return null;
};

const AdminLedger = (props: { adminCredentials: Credentials; onComplete: () => void }) => {
  const { adminCredentials, onComplete } = props;
  const userParties = retrieveUserParties() || [];

  const ledger = useLedger();

  const { contracts: operatorService, loading: operatorServiceLoading } =
    useStreamQueries(OperatorService);
  const { contracts: regulatorRoles, loading: regulatorRolesLoading } =
    useStreamQueries(RegulatorRole);
  const { contracts: regulatorServices, loading: regulatorServicesLoading } =
    useStreamQueries(RegulatorService);
  const { contracts: regulatorServiceOffers, loading: regulatorServiceOffersLoading } =
    useStreamQueries(RegulatorOffer);

  useEffect(() => {
    const createOperatorService = async () => {
      return await ledger.create(OperatorService, {
        operator: adminCredentials.party,
        observers: makeDamlSet([publicParty]),
      });
    };

    const createRegulatorRole = async () => {
      return await ledger.create(RegulatorRole, {
        operator: adminCredentials.party,
        provider: adminCredentials.party,
        observers: makeDamlSet([publicParty]),
      });
    };

    const offerRegulatorService = async (party: string) => {
      const regulatorRoleId = regulatorRoles[0]?.contractId;
      if (regulatorRoleId) {
        return await ledger.exercise(RegulatorRole.OfferRegulatorService, regulatorRoleId, {
          customer: party,
        });
      }
    };

    const offerRegulatorServices = async () => {
      await Promise.all(
        userParties.map(async party => {
          if (
            !regulatorServices.find(c => c.payload.customer === party.party) &&
            !regulatorServiceOffers.find(c => c.payload.customer === party.party)
          ) {
            return await offerRegulatorService(party.party);
          }
        })
      );
    };

    if (
      operatorServiceLoading ||
      regulatorRolesLoading ||
      regulatorServicesLoading ||
      regulatorServiceOffersLoading
    ) {
      return;
    }

    if (
      userParties.every(
        p =>
          !!regulatorServiceOffers.find(c => c.payload.customer === p.party) ||
          !!regulatorServices.find(contract => contract.payload.customer === p.party)
      )
    ) {
      return onComplete();
    }
    if (operatorService.length === 0) {
      createOperatorService();
    } else if (regulatorRoles.length === 0) {
      createRegulatorRole();
    } else {
      offerRegulatorServices();
    }
  }, [
    ledger,
    adminCredentials.party,
    userParties,
    onComplete,
    regulatorRolesLoading,
    operatorServiceLoading,
    regulatorServicesLoading,
    regulatorServiceOffersLoading,
    regulatorServices,
    regulatorRoles,
    operatorService,
    regulatorServiceOffers,
  ]);

  return null;
};

export default AddPartiesPage;
