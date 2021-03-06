

import React from 'react';
import { ethers } from 'ethers'
import { debounce } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';

import {
    useWeb3React,
    UnsupportedChainIdError
} from "@web3-react/core";

import XDITTO_ABI from '../lib/contract/abi.json';
import DITTO_ABI from '../lib/contract/DITTOAbi.json';
import Mint_Factory_ABI from '../lib/contract/MintFactory.json'
import RedeemButton from '../components/RedeemButton';

const useStyles = makeStyles((theme) => ({
    redeemForm: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '10%',
        [theme.breakpoints.up('md')]: {
            marginTop: '2.5%'
        },
    },
    inputField: {
        width: '95%',
        [theme.breakpoints.up('md')]: {
            width: '40%'
        },
    }
}));

export default function RedeemForm() {
    const classes = useStyles();

    const [xDittoContract, setXDittoContract] = React.useState();
    const [dittoContract, setDittoContract] = React.useState();
    const [inputXDitto, setInputXDitto] = React.useState();
    const [xDittoBalance, setXDittoBalance] = React.useState('0');
    const [MintFactory, setMintFactory] = React.useState();
    const [dittoOutput, setDittoOutput] = React.useState(0);

    const context = useWeb3React();
    const {
        connector,
        library,
        chainId,
        account,
        activate,
        deactivate,
        active,
        error
    } = context;

    React.useEffect(() => {
        const getXDittoValues = async () => {
            const newXDittoContract = new ethers.Contract('0xed907a2aF9f64507E3b8b8F0c5c4fd086d1986A2', XDITTO_ABI, library.getSigner());
            const latestXDittoBalance = await newXDittoContract.balanceOf(account);
            const formattedXDittoBalance = ethers.utils.formatUnits(latestXDittoBalance, 18);
            setXDittoBalance(formattedXDittoBalance);
            setXDittoContract(newXDittoContract);
        }

        const getDittoContract = async () => {
            const newDittoContract = new ethers.Contract('0xfdfd27ae39cebefdbaac8615f18aa68ddd0f15f5', DITTO_ABI, library.getSigner());
            setDittoContract(newDittoContract);
        }
        const getMintFactoryContract = async () => {
            const newMintFactory = new ethers.Contract('0xb24eb549dec4804886b22764b34ac3078abcddb8', Mint_Factory_ABI, library.getSigner());
            setMintFactory(newMintFactory);
        }
        if (library) {
            getXDittoValues();
            getDittoContract();
            getMintFactoryContract();
        }

    }, [library, chainId]);

    const getDittoRedeemOutput = async (input) => {
        const redeemOutput = await xDittoContract.getRedeemAmount(input);
        setDittoOutput(inputValue-(inputValue/5));
    }

    const handleInputChange = (inputValue) => {
        if (inputValue === '' || inputValue === undefined) {
            setDittoOutput(0);
        }
        else {
            const inputXDitto = ethers.utils.parseUnits(inputValue, 18);
           setDittoOutput(inputValue-(inputValue/5));

        }
    }

    const calculateDittoRedeemOutput = debounce((inputValue) => handleInputChange(inputValue), 500);


    return (
        <form className={classes.redeemForm} noValidate autoComplete="off">
            <TextField
                id="redeem-amount-input"
                className={classes.inputField}
                label="Amount of WGHD to redeem from"
                variant="outlined"
                color="primary"
                value={inputXDitto}
                onChange={(e) => {
                    setInputXDitto(e.target.value);
                    calculateDittoRedeemOutput(e.target.value);
                }}
                type="number"
                disabled={
                    (account === undefined || account === null)
                }
                InputLabelProps={{ shrink: true }}
                inputProps={{
                    min: 0,
                }}
                InputProps={{
                    endAdornment: <InputAdornment position="start">
                        <Button
                            disabled={
                                (account === undefined || account === null || parseFloat(xDittoBalance) === 0)
                            }
                            onClick={() => {
                                setInputXDitto(xDittoBalance);
                                calculateDittoRedeemOutput(xDittoBalance);
                            }}>
                            Max
                            </Button>
                        <Typography>WGHD</Typography>
                    </InputAdornment>,
                }} />
            <ArrowDownwardIcon color="primary" style={{ fontSize: 70, marginTop: '5px', marginBottom: '5px' }} />
            <TextField
                id="ditto-amount-ouput"
                className={classes.inputField}
                label="Receive"
                variant="outlined"
                value={dittoOutput}
                color="primary"
                InputProps={{
                    readOnly: true,
                    endAdornment: <InputAdornment position="start"><Typography>GHD</Typography></InputAdornment>,
                }}
            />
            <RedeemButton xDittoContract={xDittoContract} dittoContract={dittoContract} inputXDitto={inputXDitto} FactoryContract={MintFactory} />
        </form>
    );
};
