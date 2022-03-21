import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'
import './HomePage.css'
import home1 from '../../images/home1.gif'
import home2 from '../../images/home2.png'
import home3 from '../../images/home3.png'

const HomePage = () => {
  return (
    <div className="constrain">
      <div className="outer-container">
        <div className="content-section-container text-centered bp-100 hero-section">
          <img src={home2} alt="exercise" />

          <div className="hero-text">
            <h1>
              A decentralized <span className="header-bold"> Staking </span>{' '}
              dApp
            </h1>
            <p>
              NFT Revenue Share app incentivizes users to stake and hold for a
              long term to gain higher rewards on their ERC20 tokens while
              owning their liquidity through a revenue share mechanism.
            </p>
            <p>
              NFT Revenue Share's staking rewards are available for 100
              cryptocurrencies, and they go as high as 20% per year. The service
              also gets high marks for the liquidity it offers. There's no
              minimum time you need to stake your cryptocurrency to earn
              rewards, though you earn more the longer you stake. Rewards are
              distributed either once or twice a week, depending on the
              cryptocurrency being used.
            </p>

            <Button className="btn btn-primary" component={Link} to="/projects">
              Discover
            </Button>
          </div>
        </div>

        <div className="left-to-right">
          <div className="content-section-container workout-img-2">
            <img src={home1} alt="exercise" />
          </div>
          <div className="blue-bg">
            <div className="content-section-container">
              <h2>
                Why to <span className="header-bold">Stake</span> with us?
              </h2>
              <p>
                ‣ Stake ERC20 Token Project for a period of time and get an NFT.
              </p>

              <p>
                ‣ Rewards to NFT holders are directly proportional to the
                staking duration.
              </p>

              <p>‣ You earn more rewards, the longer you stake.</p>

              <p>
                ‣ Unique Revenue Share Mechanism using Merkle Tree(similar to
                airdrops)
              </p>
              <p>‣ NFT will be categorized based on the stake duration </p>
              <p>
                ‣ Diamond Hand, Platinum Hand, Golden Hand, Silver Hand, Paper
                Hand.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bp-100"></div>

      <div className="gradient-blue-bg">
        <div className="content-section-container text-centered tp-80 trainer-text">
          <h2 className="header-bold">A Truly Decentralize App </h2>
          <h6>That allows anyone to stake around the world.</h6>
          <p className="player-description">
            NFT Revenue Share is a decentralized blockchain oracle network built
            on Ethereum. The network is intended to be used to facilitate the
            transfer of tamper-proof data from off-chain sources to on-chain
            smart contracts.
          </p>
          <p className="player-description">
            Get started today and stake and withdraw your project tokens and get
            an NFT. You can also, visualize all your NFTs like cards with their
            data amount staked, period of time of staking, and when your stake
            ends.
          </p>
          <Button className="btn btn-secondary" component={Link} to="/projects">
            Get Started
          </Button>
        </div>

        <img src={home3} alt="person" className="img-banner3" />
      </div>

      <div className="bp-100"></div>
    </div>
  )
}

export default HomePage
