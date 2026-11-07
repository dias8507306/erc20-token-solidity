const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EduToken", function () {
  const unit = (n) => ethers.parseUnits(String(n), 18);

  async function deploy() {
    const [A, B] = await ethers.getSigners();
    const token = await ethers.deployContract("EduToken");
    return { token, A, B };
  }

  it("mints 4000 EDU to the deployer", async function () {
    const { token, A } = await deploy();
    expect(await token.name()).to.equal("Edu Token");
    expect(await token.symbol()).to.equal("EDU");
    expect(await token.decimals()).to.equal(18n);
    expect(await token.totalSupply()).to.equal(unit(4000));
    expect(await token.balanceOf(A.address)).to.equal(unit(4000));
  });

  it("transfers tokens", async function () {
    const { token, A, B } = await deploy();
    await expect(token.transfer(B.address, unit(400)))
      .to.emit(token, "Transfer")
      .withArgs(A.address, B.address, unit(400));
    expect(await token.balanceOf(B.address)).to.equal(unit(400));
  });

  it("supports approve + transferFrom and enforces the allowance", async function () {
    const { token, A, B } = await deploy();
    await token.transfer(B.address, unit(400));
    await token.approve(B.address, unit(200));
    await token.connect(B).transferFrom(A.address, B.address, unit(80));

    expect(await token.balanceOf(A.address)).to.equal(unit(3520));
    expect(await token.balanceOf(B.address)).to.equal(unit(480));
    expect(await token.allowance(A.address, B.address)).to.equal(unit(120));

    await expect(token.connect(B).transferFrom(A.address, B.address, unit(121)))
      .to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance");
    expect(await token.totalSupply()).to.equal(unit(4000));
  });
});
