import { expect } from "chai"; import { network } from "hardhat";
describe("IdeaChain contract", function () { it("debería registrar una idea y guardarla correctamente", async function () { const { ethers } = await network.connect();
const IdeaChain = await ethers.getContractFactory("IdeaChain");
const ideaChain = await IdeaChain.deploy();
await ideaChain.waitForDeployment();

const titulo = "Mi primera idea";
const descripcion = "Esta es una descripción de prueba";

const tx = await ideaChain.registerIdea(titulo, descripcion);
await tx.wait();

const count = await ideaChain.getIdeasCount();
expect(count).to.equal(1n);

const idea = await ideaChain.getIdea(0);

expect(idea[0]).to.equal(1n);
expect(idea[1]).to.equal(titulo);
expect(idea[2]).to.equal(descripcion);
}); });
