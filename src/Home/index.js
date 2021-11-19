import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useMemo, useState } from 'react';
import { Accordion, Row, Col, Form, Button, Navbar, Container } from 'react-bootstrap';
import BscDapp from '@obsidians/bsc-dapp';
import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from 'ethers';
import logo from '../assets/img/logo.png';
import './home.css';
import background from '../assets/img/background.jpg';
import img1 from '../assets/img/img1.png';
import img2 from '../assets/img/img2.png';
import img3 from '../assets/img/img3.png';
import img4 from '../assets/img/img4.png';
import img5 from '../assets/img/img5.png';

import icon_telegram from '../assets/img/telegram.png';
import icon_twitter from '../assets/img/twitter.png';
import icon_facebook from '../assets/img/facebook.png';
import icon_instagram from '../assets/img/instagram.png';
import icon_poocoin from '../assets/img/icon_poocoin.png';
import icon_cmc from '../assets/img/icon_cmc.png';
import icon_gecko from '../assets/img/icon_gecko.png';
import icon_scan from '../assets/img/icon_bscscan.png';
import footer_logo from '../assets/img/txt-logo.png';

import abi from '../Contract/abi.json';
import { isCompositeComponent } from 'react-dom/cjs/react-dom-test-utils.production.min';

function Home() {

    const dapp = useMemo(() => new BscDapp(), []);
    window.dapp = dapp;

    const [enabled, setEnabled] = useState(dapp.isBrowserExtensionEnabled);
    const [account, setAccount] = useState(dapp.currentAddress);
    const [network, setNetwork] = useState();
    const [balanceOfRes, setBalanceOfRes] = useState('0.0');
    const [totalDistributedRes, setTotalDistributedRes] = useState('0.0');
    const [releasedBUSDRes, setReleasedBUSDRes] = useState('0.0');
    const [excludedBUSDRes, setExcludedBUSDRes] = useState('0.0');
    const [penaltyTaxRes, setPenaltyTaxRes] = useState('0.0');
    const [totalMarketingRes, setTotalMarketingRes] = useState('0.0');

    const [contractInfo, setContractInfo] = useState({
        address: '0x617b2E3c10325C546533Ecae277bcf9964aB3373',
        // address: '0xB16286c2A63367eE328a500324B671fD6658b409',
    })

    useEffect(() => {
        if (dapp) {
            dapp.onEnabled(account => {
                setEnabled(true);
                setAccount(account);
                updateNetwork(dapp.network);
            })
        }
    }, [dapp])

    useEffect(() => {
        if (account && dapp?.network && dapp?.executeContract && enabled) {
            console.log('before load data:', account, dapp, enabled)
            setTimeout(() => {
                loadData();
            }, 500)
        }
    }, [account, dapp, enabled])


    const updateNetwork = (network = {}) => {
        if (network.isBscMainnet) {
            setNetwork('Mainnet')
        } else if (network.isBscTestnet) {
            setNetwork('Testnet')
        } else {
            setNetwork()
        }
    }

    let browserExtensionStatus;
    let enableButton = null;
    if (dapp.isBrowserExtensionInstalled) {
        browserExtensionStatus = `${dapp.browserExtension.name} Detected. ${enabled ? 'Enabled.' : 'Not enabled'}`;
        if (!enabled) {
            enableButton = (
                <Button className="btn_connect" onClick={() => dapp.enableBrowserExtension()}>
                    CONNECT WALLET
                </Button>
            )
        } else {
            
        }
    } else {
        browserExtensionStatus = 'No Browser Extension detected'
    }

    let accountInfo = null
    if (enabled && account) {
        accountInfo = (
            <div className="account_info">
                Connected Account: <span style={{color: 'yellow'}}>{account.address}</span>
            </div>
        )
    }

    let networkInfo = null
    if (enabled) {
        if (network) {
            networkInfo = <p style={{color: 'white'}}>Network: BSC {network}</p>
        } else {
            networkInfo = <p></p>
        }
    }

    const execute = async (name, params = []) => {
        const { address } = contractInfo;
        const param = {address, abi};
        const txParams = await dapp.executeContract(param, name, params);
        const txHash = await dapp.sendTransaction({
          from: account.address,
          value: dapp.parseEther('0'),
          ...txParams,
        });

        console.log(txParams);
    
        console.log(txHash);
    }

    const loadData = async () => {
        balanceOf();
        getTotalDistributed();
        getRealisedbusd();
        getExcludedbusd();
        getpenaltyFee();
    }

    const balanceOf = async () => {
        const { address } = contractInfo;
        const param = {address, abi};
        const txParams = await dapp.executeContract(param, 'balanceOf', [account.address]);

        const result = await dapp.rpc.call(txParams);
        const bgNumber = BigNumber.from(result);
        const res = ethers.utils.formatEther(bgNumber)*1000000000;
        console.log(res);
        setBalanceOfRes(res);
    }

    const getTotalDistributed = async () => {
        const { address } = contractInfo;
        const param = {address, abi};
        const txParams = await dapp.executeContract(param, 'gettotaldistributed', []);

        const result = await dapp.rpc.call(txParams);
        const bgNumber = BigNumber.from(result);
        const res = ethers.utils.formatEther(bgNumber)
        console.log(res)
        setTotalDistributedRes(res);
    }

    const getRealisedbusd = async () => {
        const { address } = contractInfo;
        const param = {address, abi};
        const txParams = await dapp.executeContract(param, 'getRealisedbusd', [account.address]);

        const result = await dapp.rpc.call(txParams);
        const bgNumber = BigNumber.from(result);
        const res = ethers.utils.formatEther(bgNumber);
        console.log(res);
        setReleasedBUSDRes(res);
    }

    const getExcludedbusd = async () => {
        const { address } = contractInfo;
        const param = {address, abi};
        const txParams = await dapp.executeContract(param, 'getExcludedbusd', [account.address]);

        const result = await dapp.rpc.call(txParams);
        const bgNumber = BigNumber.from(result);
        const res = ethers.utils.formatEther(bgNumber);
        console.log(res);
        setExcludedBUSDRes(res);
    }

    const getpenaltyFee = async () => {
        const { address } = contractInfo;
        const param = {address, abi};
        const txParams = await dapp.executeContract(param, 'getpenaltyFee', [account.address]);

        const result = await dapp.rpc.call(txParams);
        const bgNumber = BigNumber.from(result);
        const res = bgNumber.toString();
        console.log(res);
        setPenaltyTaxRes(res);
    }

    const getTotalMarketing = async () => {
        const { address } = contractInfo;
        const param = {address, abi};
        const txParams = await dapp.executeContract(param, 'getTotalMarketing', []);

        const result = await dapp.rpc.call(txParams);
        const bgNumber = BigNumber.from(result);
        const res = ethers.utils.formatEther(bgNumber)
        console.log(res)
        setTotalMarketingRes(res);
    }

    const submit = async () => {
        loadData();
    }

    
        return (<>
            <Navbar className="header">
                <Container>
                    <img src={logo} className="logo" alt="logo" />
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        {enableButton}
                        {/* {browserExtensionStatus} */}
                        {/* <div className="connected_account">Account: </div> */}
                        {accountInfo}
                        {/* {networkInfo} */}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div className="page-content pt-5" style={{backgroundImage: `url(${background})`}}>
                <Container>
                    <Row>
                        <Col>
                            <h2 className="title">earnings dashboard</h2>
                        </Col>
                        <Col className="text-end">
                            <div className="price-wrapper">
                                <div className="price-left">
                                    <div div className="inner">
                                        <div style={{flex: 1, alignItems: 'center', marginRight: 5, textAlign: 'center'}}>
                                            <span>24</span><br />
                                            <span>HOUR</span>
                                        </div>
                                        <div style={{flex: 4, textAlign: 'left', marginLeft: '20px'}}>
                                            <span>H&nbsp;&nbsp;&nbsp;<span style={{ color: 'green' }}>0.0000070000</span></span><br/>
                                            <span>L&nbsp;&nbsp;&nbsp;<span style={{ color: 'red' }}>0.0000070000</span></span><br/>
                                            <span>%&nbsp;&nbsp;&nbsp;<span style={{ color: 'green' }}>0.0000070000%</span></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="price-right">
                                    <div className="inner">
                                        <span className="symbol float-start">$</span>
                                        <span className="price">0.0000065435</span>
                                    </div>    
                                </div>
                                <img src={img1} />
                                
                            </div>
                        </Col>
                    </Row>

                    <Row className="mt-5 pt-5">
                        <Col className="pe-4">
                            <div className="item-wrapper">
                                <div className="img-wrapper">
                                    <img src={img1} />
                                </div>
                                <div className="inner">
                                    <span>{balanceOfRes}</span>
                                    <h5 className="item-title">Your ApeBUSD Holdings</h5>
                                </div>
                                <p className="item-description mt-2">Minimum balance of 1000.000<br /> ApeBUSD required to earn</p>
                            </div>
                        </Col>
                        <Col className="ps-4 pe-4">
                            <div className="item-wrapper">
                                <div className="img-wrapper">
                                    <img src={img2} />
                                </div>
                                <div className="inner">
                                    <span>{releasedBUSDRes}</span>
                                    <h5 className="item-title">Total BUSD Paid</h5>
                                </div>
                                <p className="item-description mt-2">Every $10 in BUSD paid earns<br /> one (1) competition entry</p>
                            </div>
                        </Col>
                        <Col className="ps-4 pe-4">
                            <div className="item-wrapper">
                                <div className="img-wrapper">
                                    <img src={img2} />
                                </div>
                                <div className="inner">
                                    <span>{excludedBUSDRes}</span>
                                    <h5 className="item-title">Pending BUSD Payment</h5>
                                </div>
                                <p className="item-description mt-2">BUSD Reflections paid<br /> automatically every 2 hours</p>
                            </div>
                        </Col>
                        <Col className="ps-4">
                            <div className="item-wrapper">
                                <div className="img-wrapper">
                                    <img src={img3} />
                                </div>
                                <div className="inner">
                                    <span>{penaltyTaxRes}</span>
                                    <h5 className="item-title">Current Penalty Tax</h5>
                                </div>
                                <p className="item-description mt-2">The Penalty Tax % of your<br /> newest ApeBUSD tokens</p>
                            </div>
                        </Col>
                    </Row>

                    <div className="total_item">
                        <div className="item-title">
                            <img src={img2} />
                            <span>Total BUSD Paid to Holders</span>
                        </div>
                        <div className="value">
                            <span>{totalDistributedRes}</span>
                        </div>
                    </div>

                    <div className="total_item">
                        <div className="item-title">
                            <img src={img4} />
                            <span>Total BNB in Marketing / Buyback Wallet</span>
                        </div>
                        <div className="value">
                            <span>{totalMarketingRes}</span>
                        </div>
                    </div>

                    <div className="competition">
                        <img src={img5} className="image"></img>
                        <div className="inner">
                            <div className="title_wrapper">
                                <div>
                                    <span className="main-title">Competition Entries</span><br />
                                    <span className="small_title">$200k USD Prize</span>
                                </div>
                                
                            </div>
                            <div className="competition_content">
                                <span style={{textAlign: 'right', fontSize: 26, color: 'white'}}>{Math.floor(releasedBUSDRes/10)}</span>
                            </div>
                            
                        </div>

                        <p style={{textAlign: 'right', color: 'white', fontSize: 16}}>Drwan on "World Gorilla Day"-September 2022</p>
                    </div>
                    
                    
                </Container>
            </div>
            <div className="footer">
                <Container>
                    <Row>
                        <Col>
                            <div className="footer-item">
                                <img src={icon_telegram} />
                                <a href="#">t.me/apebusd</a>
                            </div>

                            <div className="footer-item">
                                <img src={icon_twitter} />
                                <a href="#">twitter.com/apebusd</a>
                            </div>

                            <div className="footer-item">
                                <img src={icon_facebook} />
                                <a href="#">facebook.com/groups/apebusd</a>
                            </div>

                            <div className="footer-item">
                                <img src={icon_instagram} />
                                <a href="#">instagram.com/apebusd</a>
                            </div>
                        </Col>
                        <Col>
                            <div className="footer-item">
                                <img src={icon_poocoin} />
                                <a href="#">PooCoin</a>
                            </div>

                            <div className="footer-item">
                                <img src={icon_cmc} />
                                <a href="#">CMC</a>
                            </div>

                            <div className="footer-item">
                                <img src={icon_gecko} />
                                <a href="#">CoinGecko</a>
                            </div>

                            <div className="footer-item">
                                <img src={icon_scan} />
                                <a href="#">BSCScan</a>
                            </div>
                        </Col>
                        <Col></Col>
                        <Col>
                            <div className="footer_logo text-end">
                                <div className="inner">
                                    <img src={footer_logo} />
                                    <p>enquiries@apbusd.com</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default Home;