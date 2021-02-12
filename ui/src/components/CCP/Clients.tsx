import React, {useState} from 'react'
import { Header, Divider } from 'semantic-ui-react'

import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'

import { UserIcon, AddPlusIcon } from '../../icons/Icons'
import { useContractQuery } from '../../websocket/queryStream'

import { depositSummary } from '../common/utils'
import StripedTable from '../common/StripedTable'
import PageSection from '../common/PageSection'
import Page from '../common/Page'

import MarginCall from './MarginCall'
import { CCP } from '@daml.js/da-marketplace/lib/Marketplace/CentralCounterparty'
import {CCPCustomer} from '@daml.js/da-marketplace/lib/Marketplace/CentralCounterpartyCustomer'
import {CCPCustomerInfo, wrapDamlTuple} from '../common/damlTypes'
import { useParty, useLedger } from '@daml/react'
import {useOperator} from '../common/common'
import AddRegisteredPartyModal from '../common/AddRegisteredPartyModal'
import {RegisteredInvestor} from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import MarkToMarketCalc from './MarkToMarketCalc'

type Props = {
    clients: {
        party: any;
        label: string;
    }[];
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const Clients: React.FC<Props> = ({ clients, sideNav, onLogout }) => {
    const allDeposits = useContractQuery(AssetDeposit);
    const ccp = useParty();
    const ledger = useLedger();
    const operator = useOperator();
    const [ showAddRelationshipModal, setShowAddRelationshipModal ] = useState(false);

    const handleCCPCustomerInviteSubmit = async (party: string) => {
        const choice = CCP.CCP_InviteCustomer;
        const key = wrapDamlTuple([operator, ccp]);
        const args = { ccpCustomer: party };

        await ledger.exerciseByKey(choice, key, args);
    }

    const registeredInvestors = useContractQuery(RegisteredInvestor);
    const partyOptions = registeredInvestors.map(d => {
        return {
            text: `${d.contractData.name}`,
            value: d.contractData.investor
        }
    })

    const tableHeadings = ['Name', 'In Good Standing', 'Clearing Account', 'Margin Account']
    const ccpCustomers = useContractQuery(CCPCustomer);

    const tableRows = clients.map(client => {
        const currentCCPCustomers = ccpCustomers.filter(ccpCustomer => ccpCustomer.contractData.ccpCustomer === client.party)
        const marginDepositCids = currentCCPCustomers
            .flatMap(ccpCustomer => {
                return ccpCustomer.contractData.marginDepositCids
            });
        const customerName = client.label
        const allCustomerDeposits = allDeposits.filter(deposit => deposit.contractData.account.owner === client.party)
        const marginDeposits = allCustomerDeposits.
                filter(deposit => marginDepositCids.includes(deposit.contractId));
        const clearingDeposits = allCustomerDeposits.filter(cd => !marginDepositCids.includes(cd.contractId));
        const inGoodStanding = currentCCPCustomers[0].contractData.inGoodStanding ? "Yes" : "No";
        return [customerName, inGoodStanding, depositSummary(clearingDeposits).join(','), depositSummary(marginDeposits).join(',')]
    });

    return (
        <Page
            sideNav={sideNav}
            onLogout={onLogout}
            menuTitle={<><UserIcon size='24'/> Clients</>}
        >
            <PageSection>
                <div className='clients'>
                    <div className='client-list'>
                        <Header as='h2'>Customers</Header>
                        <a className='a2' onClick={()=> setShowAddRelationshipModal(true)}>
                            <AddPlusIcon/> Add Investor
                        </a>
                        <StripedTable
                            headings={tableHeadings}
                            rows={tableRows}
                            emptyLabel='There are no customers.'/>
                    </div>
                    <MarginCall/>
                    {showAddRelationshipModal &&
                        <AddRegisteredPartyModal
                            title='Add Investor'
                            partyOptions={partyOptions}
                            onRequestClose={() => setShowAddRelationshipModal(false)}
                            multiple={false}
                            emptyMessage='All registered investors have been added'
                            onSubmit={handleCCPCustomerInviteSubmit}/>
                    }
                </div>
            </PageSection>
        </Page>
    )
}

export default Clients;
