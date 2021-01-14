import React from 'react'

import marketplaceLogo from './marketplace.svg'
import exchange from './exchange.svg'
import lock from './lock.svg'
import logout from './logout.svg'
import orders from './orders.svg'
import publicIcon from './public.svg'
import user from './user.svg'
import wallet from './wallet.svg'

import './Icons.scss'

type IconProps = {
    size?: '24' | '32' | '48' | '64';
}

export const ArrowRightIcon = () => (
    <svg className="icon arrow-right-icon" viewBox="0 0 13 12">
        <path
            d="M6.3,2.3L9,5H0.8C0.4,5,0,5.3,0,5.8s0.3,0.8,0.8,0.8H9L6.3,9.3C6.2,9.4,6.1,9.6,6.1,9.8s0.1,0.4,0.2,0.5
            c0.3,0.3,0.8,0.3,1.1,0l4-4c0.1-0.1,0.1-0.2,0.1-0.3c0.1-0.1,0.1-0.4,0-0.5c0-0.1-0.1-0.2-0.2-0.2l-4-4C7,1,6.5,1,6.2,1.3
            C6,1.5,6,2,6.3,2.3"/>
    </svg>
)

export const GlobeIcon = () => (
    <svg className="icon globe-icon" viewBox="0 0 16 16">
      <path className="fill-primary" d="M4.79999 5.86678V5.36678C4.52385 5.36678 4.29999 5.59064 4.29999 5.86678H4.79999ZM4.79999
        6.93345L5.15354 7.287L5.29999 7.14055V6.93345H4.79999ZM2.97908 7.24587L2.62552 7.59942H2.62552L2.97908
        7.24587ZM6.93332 13.8668H7.43332V13.6597L7.28688 13.5132L6.93332 13.8668ZM5.86666 12.8001H5.36666V13.0072L5.5131
        13.1537L5.86666 12.8001ZM5.86666 11.2001H6.36666V10.993L6.22021 10.8466L5.86666 11.2001ZM4.79999 10.1334H4.29999V10.3406L4.44644
        10.487L4.79999 10.1334ZM4.79999 9.06678V8.56678C4.52385 8.56678 4.29999 8.79064 4.29999 9.06678H4.79999ZM9.63332
        0.533447V2.66678H10.6333V0.533447H9.63332ZM9.06666 3.23345H7.99999V4.23345H9.06666V3.23345ZM5.86666
        5.36678H4.79999V6.36678H5.86666V5.36678ZM4.29999 5.86678V6.93345H5.29999V5.86678H4.29999ZM4.44644
        6.57989L4.13402 6.89231L4.84113 7.59942L5.15354 7.287L4.44644 6.57989ZM3.33263 6.89231L1.42021
        4.97989L0.713105 5.687L2.62552 7.59942L3.33263 6.89231ZM6.43332 4.80011C6.43332 5.11307 6.17962
        5.36678 5.86666 5.36678V6.36678C6.7319 6.36678 7.43332 5.66536 7.43332 4.80011H6.43332ZM7.99999
        3.23345C7.13475 3.23345 6.43332 3.93487 6.43332 4.80011H7.43332C7.43332 4.48715 7.68703 4.23345
        7.99999 4.23345V3.23345ZM4.13402 6.89231C3.91272 7.11361 3.55393 7.11361 3.33263 6.89231L2.62552
        7.59942C3.23735 8.21124 4.2293 8.21124 4.84113 7.59942L4.13402 6.89231ZM9.63332 2.66678C9.63332
        2.97974 9.37962 3.23345 9.06666 3.23345V4.23345C9.9319 4.23345 10.6333 3.53203 10.6333 2.66678H9.63332ZM7.43332
        15.4668V13.8668H6.43332V15.4668H7.43332ZM7.28688 13.5132L6.22021 12.4466L5.5131 13.1537L6.57977 14.2203L7.28688
        13.5132ZM6.36666 12.8001V11.2001H5.36666V12.8001H6.36666ZM6.22021 10.8466L5.15354 9.77989L4.44644 10.487L5.5131
        11.5537L6.22021 10.8466ZM5.29999 10.1334V9.06678H4.29999V10.1334H5.29999ZM4.79999 9.56678H9.06666V8.56678H4.79999V9.56678ZM9.63332
        10.1334V10.8446H10.6333V10.1334H9.63332ZM11.5555 12.7668H14.4V11.7668H11.5555V12.7668ZM10.7 11.9112C10.7 12.3837
        11.083 12.7668 11.5555 12.7668V11.7668C11.6353 11.7668 11.7 11.8314 11.7 11.9112H10.7ZM10.4889 11.7001C10.6055
        11.7001 10.7 11.7946 10.7 11.9112H11.7C11.7 11.2423 11.1578 10.7001 10.4889 10.7001V11.7001ZM9.63332 10.8446C9.63332
        11.3171 10.0164 11.7001 10.4889 11.7001V10.7001C10.5687 10.7001 10.6333 10.7648 10.6333 10.8446H9.63332ZM9.06666
        9.56678C9.37962 9.56678 9.63332 9.82049 9.63332 10.1334H10.6333C10.6333 9.2682 9.9319 8.56678 9.06666
        8.56678V9.56678ZM7.99999 14.9668C4.15241 14.9668 1.03333 11.8477 1.03333 8.00011H0.0333252C0.0333252
        12.4 3.60012 15.9668 7.99999 15.9668V14.9668ZM14.9667 8.00011C14.9667 11.8477 11.8476 14.9668
        7.99999 14.9668V15.9668C12.3999 15.9668 15.9667 12.4 15.9667 8.00011H14.9667ZM7.99999
        1.03345C11.8476 1.03345 14.9667 4.15253 14.9667 8.00011H15.9667C15.9667 3.60025 12.3999 0.0334473 7.99999
        0.0334473V1.03345ZM7.99999 0.0334473C3.60012 0.0334473 0.0333252 3.60025 0.0333252 8.00011H1.03333C1.03333
        4.15253 4.15241 1.03345 7.99999 1.03345V0.0334473Z"/>
    </svg>
  );

export const LogoIcon: React.FC<IconProps> = ({ size }) => (
    <img
        className={`icon logo-icon icon-size-${size}`}
        src={marketplaceLogo}
        alt="command"/>
)

export const CandlestickIcon = () => (
    <svg className='icon icon-size-24 candlestick-icon' width="20" preserveAspectRatio="none" height="20" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line y1="9.9165" x2="18" y2="9.9165" stroke="white" strokeWidth="1.5" strokeDasharray="1 1"/>
        <line x1="3.5" y1="0.5" x2="3.5" y2="15.5" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="9.5" y1="0.5" x2="9.5" y2="15.5" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="15.5" y1="0.5" x2="15.5" y2="15.5" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="2.5" y="3.5" width="2" height="3" fill="white" stroke="white"/>
        <rect x="8.5" y="7.5" width="2" height="5" fill="white" stroke="white"/>
        <rect x="14.5" y="4.30957" width="2" height="7.38095" fill="white" stroke="white"/>
    </svg>
)

export const ExchangeIcon = () => (
    <img
        className="icon exchange-icon"
        src={exchange}
        alt="command"/>
)

export const LockIcon = () => (
    <img
        className="icon lock-icon"
        src={lock}
        alt="command"/>
)

export const LogoutIcon = () => (
    <img
        className="icon logout-icon"
        src={logout}
        alt="command"/>
)

export const MarketIcon = () => (
    <svg className="icon market-icon" width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 4.36865L2.94737 6.05286L6.73684 4.36865L10.5263 6.05286L13.4737 4.36865V17.0002H0V4.36865Z" fill="#303132"/>
        <path d="M2.10523 6.89474C1.96488 4.92982 2.6947 1 6.73681 1" stroke="#303132" strokeWidth="1.5"/>
        <path d="M10.9314 6.89474C11.0717 4.92982 10.3419 1 6.29981 1" stroke="#303132" strokeWidth="1.5"/>
    </svg>
)

export const OrdersIcon = () => (
    <img
        className="icon orders-icon"
        src={orders}
        alt="command"/>
)

export const PublicIcon = () => (
    <img
        className="icon public-icon"
        src={publicIcon}
        alt="command"/>
)

export const UserIcon = () => (
    <img
        className="icon user-icon"
        src={user}
        alt="command"/>
)

export const WalletIcon = () => (
    <img
        className="icon wallet-icon"
        src={wallet}
        alt="command"/>
)

export const CircleIcon = () => (
    <div className="icon circle-icon"></div>
)

export const IconClose = () => (
    <svg className='icon close' viewBox="0 0 14 14">
      <path className="fill-primary" d="M8.6,7.5L12.1,4c0.3-0.3,0.3-0.8,0-1.1S11.3,2.7,11,3L7.5,6.5L4,3C3.7,2.7,3.2,2.7,3,3S2.7,3.7,3,4l3.5,3.5
          L3,11c-0.3,0.3-0.3,0.8,0,1.1c0.1,0.1,0.3,0.2,0.5,0.2s0.4-0.1,0.5-0.2l3.5-3.5l3.5,3.5c0.1,0.1,0.3,0.2,0.5,0.2s0.4-0.1,0.5-0.2
          c0.3-0.3,0.3-0.8,0-1.1L8.6,7.5z"/>
    </svg>
  );

export const IconChevronDown = () => (
<svg className='icon chevron-down' viewBox="0 -6 16 16">
    <path className="fill-primary"
        d="M7,7L1,1h2l4.5,4.4L12,1h2.1l-6,6C7.9,7.1,7.7,7.2,7.5,7.2C7.3,7.2,7.1,7.1,7,7z"/>
</svg>
);

export const IconChevronUp = () => (
    <svg className='icon chevron-up' viewBox="0 3 16 16">
        <IconChevronDown/>
    </svg>
);

export const AddPlusIcon = () => (
    <svg className='icon add-plus' viewBox="0 0 14 14" fill="none">
        <path className='fill-primary' fill-rule="evenodd" clip-rule="evenodd" d="M10.15 6.65H7.35V3.85C7.35 3.6568 7.1932 3.5 7 3.5C6.8068 3.5 6.65 3.6568 6.65 3.85V6.65H3.85C3.6568 6.65 3.5 6.8068 3.5 7C3.5 7.1932 3.6568 7.35 3.85 7.35H6.65V10.15C6.65 10.3432 6.8068 10.5 7 10.5C7.1932 10.5 7.35 10.3432 7.35 10.15V7.35H10.15C10.3432 7.35 10.5 7.1932 10.5 7C10.5 6.8068 10.3432 6.65 10.15 6.65Z" fill="#303132"/>
        <path className='fill-primary' fill-rule="evenodd" clip-rule="evenodd" d="M7 13.1764C3.59422 13.1764 0.823531 10.4058 0.823531 6.99997C0.823531 3.59419 3.59422 0.823503 7 0.823503C10.4058 0.823503 13.1765 3.59419 13.1765 6.99997C13.1765 10.4058 10.4058 13.1764 7 13.1764ZM0 7C0 10.8596 3.14042 14 7 14C10.8596 14 14 10.8596 14 7C14 3.14042 10.8596 0 7 0C3.14042 0 0 3.14042 0 7Z" fill="#303132"/>
    </svg>
);

export const OverflowIcon = () => (
    <svg className='icon overflow-icon' width='20px' viewBox="0 0 17.8 4.6">
        <circle className="fill-primary" cx="2" cy="2.3" r="2"/>
        <circle className="fill-primary" cx="8.9" cy="2.3" r="2"/>
        <circle className="fill-primary" cx="15.8" cy="2.3" r="2"/>
    </svg>
  );
