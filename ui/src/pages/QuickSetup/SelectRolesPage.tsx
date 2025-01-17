import React, { useEffect, useState } from 'react';

import classNames from 'classnames';

import DamlLedger, { useLedger } from '@daml/react';
import { CreateEvent } from '@daml/ledger';
import { Choice, ContractId } from '@daml/types';

import { Role as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Role';
import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';

import { RolesProvider, useRolesContext, RoleKind } from '../../context/RolesContext';
import { OffersProvider, useOffers } from '../../context/OffersContext';
import { AutomationProvider, useAutomations } from '../../context/AutomationContext';

import QueryStreamProvider from '../../websocket/queryStream';
import { useStreamQueries } from '../../Main';
import { ArrowLeftIcon } from '../../icons/icons';
import {
  PublishedInstance,
  getAutomationInstances,
  MarketplaceTrigger,
  deployAutomation,
} from '../../automation';
import { retrieveParties } from '../../Parties';
import Credentials, { computeToken } from '../../Credentials';
import {
  httpBaseUrl,
  wsBaseUrl,
  publicParty,
  isHubDeployment,
  useVerifiedParties,
} from '../../config';
import QuickSetupPage from './QuickSetupPage';
import { LoadingWheel, MenuItems } from './QuickSetup';

const SelectRolesPage = (props: { adminCredentials: Credentials }) => {
  const { adminCredentials } = props;

  return (
    <DamlLedger
      token={adminCredentials.token}
      party={adminCredentials.party}
      httpBaseUrl={httpBaseUrl}
      wsBaseUrl={wsBaseUrl}
    >
      <QueryStreamProvider defaultPartyToken={adminCredentials.token}>
        <AutomationProvider publicParty={publicParty}>
          <RolesProvider>
            <OffersProvider>
              <DragAndDropRoles />
            </OffersProvider>
          </RolesProvider>
        </AutomationProvider>
      </QueryStreamProvider>
    </DamlLedger>
  );
};

const DragAndDropRoles = () => {
  const ledger = useLedger();
  const automations = useAutomations();

  const { identities, loading: identitiesLoading } = useVerifiedParties();
  const { roles: allRoles, loading: rolesLoading } = useRolesContext();
  const { roleOffers, loading: offersLoading } = useOffers();

  const { contracts: operatorService, loading: operatorLoading } =
    useStreamQueries(OperatorService);

  const allTriggers =
    automations?.flatMap(auto => {
      if (auto.automationEntity.tag === 'DamlTrigger') {
        return auto.automationEntity.value.triggerNames.map(tn => {
          return `${tn}#${auto.artifactHash}`;
        });
      } else {
        return `${auto.automationEntity.value.entityName}#${auto.artifactHash}`;
      }
    }) || [];

  const roleOptions = Object.values(RoleKind)
    .filter(s => s !== RoleKind.REGULATOR && s !== RoleKind.MATCHING)
    .map(i => {
      return { name: i, value: i };
    });

  if (rolesLoading || offersLoading || operatorLoading || identitiesLoading) {
    return (
      <QuickSetupPage className="loading">
        <LoadingWheel label="Loading parties and roles..." />
      </QuickSetupPage>
    );
  }

  return (
    <QuickSetupPage
      className="select-roles"
      title="Drag and Drop Roles to Parties"
      nextItem={MenuItems.REQUEST_SERVICES}
    >
      <div className="page-row">
        <div>
          <p className="bold">Parties</p>
          <div className="party-names">
            {identities.map((p, i) => (
              <PartyRowDropZone key={i} party={p} handleAddItem={createRoleContract} />
            ))}
          </div>
        </div>
        <div className="arrow">
          <ArrowLeftIcon color="grey" />
        </div>
        <div>
          <p className="bold">Roles</p>
          <div className="drag-tiles page-row ">
            {roleOptions.map((item, i) => (
              <DraggableItemTile key={i} item={item} />
            ))}
          </div>
        </div>
      </div>
    </QuickSetupPage>
  );

  async function createRoleContract(partyId: string, token: string, role: string) {
    if (
      findExistingRoleOffer(partyId, role as RoleKind) ||
      findExistingRole(partyId, role as RoleKind)
    ) {
      return;
    }

    const provider = { provider: partyId };

    switch (role) {
      case RoleKind.CUSTODY:
        doCreate(OperatorService.OfferCustodianRole, provider);
        return;
      case RoleKind.CLEARING:
        doCreate(OperatorService.OfferClearingRole, provider);
        handleDeployment(token, MarketplaceTrigger.ClearingTrigger);
        return;
      case RoleKind.TRADING:
        doCreate(OperatorService.OfferExchangeRole, provider);
        handleDeployment(token, MarketplaceTrigger.SettlementInstructionTrigger);
        return;
      case RoleKind.SETTLEMENT:
        doCreate(OperatorService.OfferSettlementService, provider);
        handleDeployment(token, MarketplaceTrigger.SettlementInstructionTrigger);
        return;
      case RoleKind.DISTRIBUTION:
        doCreate(OperatorService.OfferDistributorRole, provider);
        return;
      default:
        throw new Error(`Unsupported role: ${role}`);
    }
  }

  async function doCreate(
    choice: Choice<OperatorService, any, ContractId<any>, string>,
    provider: { provider: string }
  ) {
    const operatorServiceContract = operatorService[0];
    return await ledger.exercise(choice, operatorServiceContract.contractId, provider);
  }

  async function handleDeployment(token: string, autoName: string) {
    if (!isHubDeployment) {
      return;
    }
    const trigger = allTriggers.find(auto => auto.startsWith(autoName));

    if (trigger) {
      const [name, hash] = trigger.split('#');

      if (hash) {
        deployAutomation(hash, name, token, publicParty);
      }
    }
  }

  function findExistingRoleOffer(provider: string, role: RoleKind) {
    return !!roleOffers.find(c => c.role === role && c.contract.payload.provider === provider);
  }

  function findExistingRole(provider: string, role: RoleKind) {
    return !!allRoles.find(c => c.role === role && c.contract.payload.provider === provider);
  }
};

const PartyRowDropZone = (props: {
  party: CreateEvent<VerifiedIdentity>;
  handleAddItem: (party: string, token: string, item: string | RoleKind) => void;
}) => {
  const { party, handleAddItem } = props;
  const { roleOffers } = useOffers();
  const { roles: allRoles } = useRolesContext();
  const parties = retrieveParties() || [];

  const [deployedAutomations, setDeployedAutomations] = useState<PublishedInstance[]>([]);
  const [dragCount, setDragCount] = useState(0);
  const token = isHubDeployment
    ? parties.find(p => p.party === party.payload.customer)?.token
    : computeToken(party.payload.customer);

  const roles = allRoles
    .filter(r => r.contract.payload.provider === party.payload.customer)
    .map(r => r.role) as string[];

  const clearingOffer = findClearingOffer(party.payload.customer);

  useEffect(() => {
    if (isHubDeployment && token) {
      const timer = setInterval(() => {
        getAutomationInstances(token).then(pd => {
          setDeployedAutomations(pd || []);
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [token]);

  let rolesList = roles;

  if (clearingOffer) {
    rolesList = [...rolesList, 'Clearing (pending)'];
  }

  return (
    <div
      className={classNames('party-name page-row', { 'drag-over': dragCount > 0 })}
      onDrop={evt => handleDrop(evt.dataTransfer.getData('text') as string)}
      onDragEnter={_ => setDragCount(dragCount + 1)}
      onDragLeave={_ => setDragCount(dragCount - 1)}
      onDragOver={evt => evt.preventDefault()}
    >
      {roles && (
        <div className="party-details">
          <p>{party.payload.legalName}</p>
          <p className="dropped-items">{rolesList.join(', ')}</p>
        </div>
      )}

      <p className="dropped-items">
        {deployedAutomations.map(da => formatTriggerName(da.config.value.name)).join(', ')}
      </p>
    </div>
  );

  function findClearingOffer(partyId: string) {
    return !!roleOffers.find(
      r => r.contract.payload.provider === partyId && r.role === RoleKind.CLEARING
    );
  }

  function handleDrop(item: string) {
    setDragCount(dragCount - 1);
    if (token) {
      handleAddItem(party.payload.customer, token, item);
    }
  }
};

const DraggableItemTile = (props: { item: { name: string; value: string } }) => {
  const { item } = props;

  function handleDragStart(evt: any) {
    evt.dataTransfer.setData('text', item.value);
  }

  return (
    <div className="drag-tile" draggable={true} onDragStart={e => handleDragStart(e)}>
      <p>{item.name}</p>
    </div>
  );
};

export function formatTriggerName(name: string) {
  return name
    .split('#')[0]
    .split(':')[0]
    .replace(/([A-Z])/g, ' $1')
    .trim();
}

export default SelectRolesPage;
