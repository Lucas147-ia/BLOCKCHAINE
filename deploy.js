import { network} from "hardhat";
const { ethers } = await network.connect();
const ideaChain = await ethers.deployContract("IdeaChain");
await ideaChain.waitForDeployment();
console.log("IdeaChain desplegado en: " , await ideaChain.getAddress());
