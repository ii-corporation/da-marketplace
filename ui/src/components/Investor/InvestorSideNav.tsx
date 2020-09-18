import React from 'react'
import { NavLink } from 'react-router-dom'
import { Header, Menu } from 'semantic-ui-react'

import { useParty } from '@daml/react'

import { ExchangeIcon, OrdersIcon, WalletIcon } from '../../icons/Icons'
import { ExchangeInfo, unwrapDamlTuple } from '../common/damlTypes'

type Props = {
    url: string;
    disabled?: boolean;
    exchanges: ExchangeInfo[];
}

const InvestorSideNav: React.FC<Props> = ({ url, exchanges, disabled }) => {
    const investor = useParty();

    const HomeMenuItem = (
        <Menu.Item
            as={NavLink}
            to={url}
            exact
        >
            <Header as='h3'>@{investor}</Header>
        </Menu.Item>
    )

    return disabled ? HomeMenuItem :
        <><Menu.Menu>
            { HomeMenuItem }
            <Menu.Item
                as={NavLink}
                to={`${url}/wallet`}
                className='sidemenu-item-normal'
            >
                <p><WalletIcon/>Wallet</p>
            </Menu.Item>

            <Menu.Item
                as={NavLink}
                to={`${url}/orders`}
                className='sidemenu-item-normal'
            >
                <p><OrdersIcon/>Orders</p>
            </Menu.Item>
        </Menu.Menu>

        <Menu.Menu>
            <Menu.Item>
                <p>Marketplace:</p>
            </Menu.Item>

            { exchanges.map(exchange => {
                return exchange.contractData.tokenPairs.map(tokenPair => {
                    const [ base, quote ] = unwrapDamlTuple(tokenPair).map(t => t.label.toLowerCase());

                    return <Menu.Item
                        as={NavLink}
                        to={{
                            pathname: `${url}/trade/${base}-${quote}`,
                            state: {
                                exchange: exchange.contractData,
                                tokenPair: unwrapDamlTuple(tokenPair)
                            }
                        }}
                        className='sidemenu-item-normal'
                        key={exchange.contractId}
                    >
                        <p><ExchangeIcon/>{base.toUpperCase()}</p>
                    </Menu.Item>
                })
            }).flat()}
        </Menu.Menu></>
}

export default InvestorSideNav
