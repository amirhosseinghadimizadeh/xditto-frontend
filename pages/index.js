import React from 'react';
import { ethers } from 'ethers'
import { makeStyles, withStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import {
  useWeb3React,
} from "@web3-react/core";

import XDITTO_ABI from '../lib/contract/abi.json';
import DITTO_ABI from '../lib/contract/DITTOAbi.json';
import ORACLE_ABI from '../lib/contract/oracleAbi.json';
import Mint_Factory_ABI from '../lib/contract/MintFactory.json'

import MintForm from '../components/MintForm'
import RedeemForm from '../components/RedeemForm'

import DesktopWalletInfo from '../components/DesktopWalletInfo';
import MobileWalletInfo from '../components/MobileWalletInfo';


const useStyles = makeStyles((theme) => ({
  mintForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '5%',
  },
  inputField: {
    width: '40%',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.primary}`,
  },
  mobileTabs: {
    display: 'block',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  desktopTabs: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


const StyledTabs = withStyles({
  root: {
    '& > *': {
      justifyContent: 'center',
    },
  },
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 90,
      width: '100%',
      backgroundColor: '#61be6c',
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(22),
    marginRight: theme.spacing(5),
    '&:focus': {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}


export default function Index() {
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

  const [exchangeRate, setExchangeRate] = React.useState();
  const [xDittoBalance, setXDittoBalance] = React.useState();
  const [dittoBalance, setDittoBalance] = React.useState();
  const [usdPrice, setUsdPrice] = React.useState();

  React.useEffect(() => {
    const getXDittoValues = async () => {
      const xDittoContract = new ethers.Contract('0xed907a2aF9f64507E3b8b8F0c5c4fd086d1986A2', XDITTO_ABI, library.getSigner());
      const xDittoBalance = await xDittoContract.balanceOf(account);
      const formattedXDittoBalance = ethers.utils.formatUnits(xDittoBalance, 18)
      setXDittoBalance(formattedXDittoBalance);
    }

    const getDittoBalance = async () => {
      const dittoContract = new ethers.Contract('0xfdfd27ae39cebefdbaac8615f18aa68ddd0f15f5', DITTO_ABI, library.getSigner());
      const dittoBalance = await dittoContract.balanceOf(account);
      const formattedDittoBalance = ethers.utils.formatUnits(dittoBalance, 18);
      setDittoBalance(formattedDittoBalance);
    }

    const getUsdPrice = async () => {
      const oracleContract = new ethers.Contract('0x2df19009b4a48636699d4dbf00e1d7f923c6fa47', ORACLE_ABI, library.getSigner());
      const oracleData = await oracleContract.getData();
      const oraclePrice = ethers.utils.formatUnits(oracleData, 18);
      setUsdPrice(oraclePrice);
    }

    if (library) {
      getXDittoValues();
      getDittoBalance();
      getUsdPrice();
    }
  }, [library, chainId]);


  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <Box>
      <DesktopWalletInfo dittoBalance={dittoBalance} xDittoBalance={xDittoBalance} exchangeRate={exchangeRate} usdPrice={usdPrice} />
      <Box marginY={3} className={classes.desktopTabs}>
        <StyledTabs centered="true" value={value} onChange={handleChange} aria-label="Navigation tabs">
          <StyledTab label="Mint WGHD" />
          <StyledTab label="Redeem GHD" />
        </StyledTabs>
        <Typography className={classes.padding} />
      </Box>
      <Box marginY={1} className={classes.mobileTabs}>
        <Tabs
          orientation="vertical"
          value={value}
          onChange={handleChange}
          aria-label="Navigation tabs"
          indicatorColor="primary"
          className={classes.tabs}
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Mint WGHD" disableRipple {...a11yProps(0)} />
          <Tab label="Redeem GHD" disableRipple {...a11yProps(1)} />
        </Tabs>
      </Box>
      <MobileWalletInfo dittoBalance={dittoBalance} xDittoBalance={xDittoBalance} exchangeRate={exchangeRate} usdPrice={usdPrice} />

      <TabPanel value={value} index={0}>
        <MintForm />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <RedeemForm />
      </TabPanel>
    </Box>
  );
}
