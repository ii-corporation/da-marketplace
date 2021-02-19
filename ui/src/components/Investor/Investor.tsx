import React, { useEffect, useState } from 'react'
import { Switch, Route, useRouteMatch, NavLink} from 'react-router-dom'
import { Label, Menu } from 'semantic-ui-react'

import { useLedger, useParty } from '@daml/react'

import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { CustodianRelationship } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { InvestorInvitation } from '@daml.js/da-marketplace/lib/Marketplace/Investor'
import { RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { ExchangeIcon, OrdersIcon, WalletIcon } from '../../icons/Icons'
import { useContractQuery } from '../../websocket/queryStream'

import { useOperator } from '../common/common'
import { wrapDamlTuple, unwrapDamlTuple, ContractInfo } from '../common/damlTypes'
import { useDismissibleNotifications } from '../common/DismissibleNotifications'
import InvestorProfile, { Profile, createField } from '../common/Profile'
import MarketRelationships from '../common/MarketRelationships'
import InviteAcceptTile from '../common/InviteAcceptTile'
import FormErrorHandled from '../common/FormErrorHandled'
import LandingPage from '../common/LandingPage'
import Wallet from '../common/Wallet'
import RoleSideNav from '../common/RoleSideNav'

import { useExchangeInviteNotifications } from './ExchangeInviteNotifications'
import { useBrokerCustomerInviteNotifications } from './BrokerCustomerInviteNotifications'
import InvestorTrade from './InvestorTrade'
import InvestorOrders from './InvestorOrders'
import { Id } from '@daml.js/da-marketplace/lib/DA/Finance/Types'


type Props = {
    onLogout: () => void;
}

const Investor: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useOperator();
    const investor = useParty();
    const ledger = useLedger();

    const notifications = [
        ...useExchangeInviteNotifications(),
        ...useBrokerCustomerInviteNotifications(),
        ...useDismissibleNotifications(),
    ];

    const registeredInvestor = useContractQuery(RegisteredInvestor);
    const invitation = useContractQuery(InvestorInvitation);
    const allExchanges = useContractQuery(Exchange);
    const allDeposits = useContractQuery(AssetDeposit);
    const allCustodianRelationships = useContractQuery(CustodianRelationship);

    const [ profile, setProfile ] = useState<Profile>({
        'name': createField('', 'Name', 'Your full legal name', 'text'),
        'location': createField('', 'Location', 'Your current location', 'text')
    });

    useEffect(() => {
        if (registeredInvestor[0]) {
            const riData = registeredInvestor[0].contractData;
            setProfile({
                name: { ...profile.name, value: riData.name },
                location: { ...profile.location, value: riData.location }
            })
        }
    // eslint-disable-next-line
    }, [registeredInvestor]);

    const updateProfile = async () => {
        const key = wrapDamlTuple([operator, investor]);
        const args = {
            newName: profile.name.value,
            newLocation: profile.location.value
        };
        await ledger.exerciseByKey(RegisteredInvestor.RegisteredInvestor_UpdateProfile, key, args)
                    .catch(err => console.error(err));
    }

    const acceptInvite = async () => {
        const key = wrapDamlTuple([operator, investor]);
        const args = {
            name: profile.name.value,
            location: profile.location.value,
            isPublic: true
        };
        await ledger.exerciseByKey(InvestorInvitation.InvestorInvitation_Accept, key, args)
                    .catch(err => console.error(err));
    }

    const sideNav = <RoleSideNav url={url}
                        name={registeredInvestor[0]?.contractData.name || investor}
                        items={[
                            {to: `${url}/wallet`, label: 'Wallet', icon: <WalletIcon/>},
                            {to: `${url}/orders`, label: 'Orders', icon: <OrdersIcon/>}
                        ]}>
                        <Menu.Menu className='sub-menu'>
                            <Menu.Item>
                                <p className='p2'>Marketplace:</p>
                            </Menu.Item>

                            { allExchanges.length > 0 ?
                                allExchanges.map(exchange => {
                                    const tokenPairs = exchange.contractData.tokenPairs.map(tokenPair => {
                                        const [ base, quote ] = unwrapDamlTuple(tokenPair).map(t => t.label.toLowerCase());

                                        return <Menu.Item
                                            as={NavLink}
                                            exact
                                            to={{
                                                pathname: `${url}/trade/${base}-${quote}`,
                                                state: {
                                                    isCleared: false,
                                                    exchange: exchange.contractData,
                                                    tokenPair: unwrapDamlTuple(tokenPair)
                                                }
                                            }}
                                            className='sidemenu-item-normal'
                                            key={`${base}${quote}`}
                                        >
                                            <p><ExchangeIcon/>{base.toUpperCase()}/{quote.toUpperCase()}</p>
                                        </Menu.Item>
                                    })

                                    const clearedMarkets = exchange.contractData.clearedMarkets.map(marketListing => {
                                        const listing = unwrapDamlTuple(marketListing);
                                        const tokenPair = typeof listing[0] !== 'string' && listing[0];
                                        const defaultCCP = typeof listing[1] === 'string' && listing[1];

                                        if (!tokenPair || !defaultCCP) {
                                            throw new Error("Expected token pair and default CCP")
                                        }

                                        const [ base, quote ] = unwrapDamlTuple(tokenPair).map(t => t.label.toLowerCase());

                                        return <Menu.Item
                                            as={NavLink}
                                            exact
                                            to={{
                                                pathname: `${url}/trade/${base}-${quote}/cleared`,
                                                state: {
                                                    defaultCCP,
                                                    isCleared: true,
                                                    exchange: exchange.contractData,
                                                    tokenPair: unwrapDamlTuple(tokenPair)
                                                }
                                            }}
                                            className='sidemenu-item-normal'
                                            key={`${base}${quote}CLR`}
                                        >
                                            <p><ExchangeIcon/>{base.toUpperCase()}/{quote.toUpperCase()}</p>
                                            <Label className='cleared-market-label'>Cleared</Label>
                                        </Menu.Item>
                                    })

                                    return [...tokenPairs, ...clearedMarkets]
                                }).flat()
                            :
                            <Menu.Item className='empty-item'>
                                <p className='p2 dark'>
                                    <i>None yet. Join an Exchange to be added to available markets.</i>
                                </p>
                            </Menu.Item>
                        }
                        </Menu.Menu>
                </RoleSideNav>

    const inviteScreen = (
        <InviteAcceptTile role={MarketRole.InvestorRole} onSubmit={acceptInvite} onLogout={onLogout}>
            <InvestorProfile
                content='Submit'
                receivedInvitation={!!invitation[0]}
                role={MarketRole.InvestorRole}
                inviteAcceptTile
                defaultProfile={profile}
                submitProfile={profile => setProfile(profile)}/>
        </InviteAcceptTile>
    );

    const investorScreen = <Switch>
        <Route exact path={path}>
            <LandingPage
                notifications={notifications}
                profile={
                    <FormErrorHandled onSubmit={updateProfile}>
                        <InvestorProfile
                            content='Save'
                            profileLinks={[
                                {to: `${url}/wallet`, title: 'Go to Wallet', subtitle: 'Add or Withdraw Funds'},
                                {to: `${url}/orders`, title: 'View Open Orders', subtitle: 'Manage your Orders'}
                            ]}
                            role={MarketRole.InvestorRole}
                            defaultProfile={profile}
                            submitProfile={profile => setProfile(profile)}/>
                    </FormErrorHandled>
                }
                sideNav={sideNav}
                marketRelationships={
                    <MarketRelationships role={MarketRole.InvestorRole}
                                         custodianRelationships={allCustodianRelationships}/>}
                onLogout={onLogout}/>
        </Route>

        <Route path={`${path}/wallet`}>
            <Wallet
                role={MarketRole.InvestorRole}
                sideNav={sideNav}
                onLogout={onLogout}/>
        </Route>

        <Route path={`${path}/orders`}>
            <InvestorOrders
                sideNav={sideNav}
                onLogout={onLogout}/>
        </Route>

        <Route path={`${path}/trade/:base-:quote`}>
            <InvestorTrade
                deposits={allDeposits}
                sideNav={sideNav}
                onLogout={onLogout}/>
        </Route>
    </Switch>

    return registeredInvestor.length === 0 ? inviteScreen : investorScreen
}

export default Investor;
