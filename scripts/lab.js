// Lab 8 (variant 4) scenario on the local Hardhat network:
// deploy -> transfer(A->B, 400) -> approve(B, 200) -> transferFrom(A->B, 80) by B -> limit check (121 reverts)
const { ethers } = require("hardhat");

const fmt = (v) => `${ethers.formatUnits(v, 18)} EDU`;

async function state(token, A, B, label) {
  const [a, b, allow] = await Promise.all([
    token.balanceOf(A.address),
    token.balanceOf(B.address),
    token.allowance(A.address, B.address),
  ]);
  console.log(`  ${label}: A = ${fmt(a)}   B = ${fmt(b)}   allowance(A,B) = ${fmt(allow)}`);
}

async function main() {
  const [A, B] = await ethers.getSigners();
  const unit = (n) => ethers.parseUnits(String(n), 18);

  console.log("> deploy EduToken()");
  const token = await ethers.deployContract("EduToken");
  await token.waitForDeployment();
  console.log(`  contract     : ${await token.getAddress()}`);
  console.log(`  name/symbol  : ${await token.name()} / ${await token.symbol()}`);
  console.log(`  decimals     : ${await token.decimals()}`);
  console.log(`  totalSupply  : ${fmt(await token.totalSupply())}`);
  await state(token, A, B, "AFTER DEPLOY");

  console.log("\n> transfer(B, 400) from A");
  await (await token.transfer(B.address, unit(400))).wait();
  await state(token, A, B, "AFTER");

  console.log("\n> approve(B, 200) from A");
  await (await token.approve(B.address, unit(200))).wait();
  await state(token, A, B, "AFTER");

  console.log("\n> transferFrom(A, B, 80) sent by B");
  await (await token.connect(B).transferFrom(A.address, B.address, unit(80))).wait();
  await state(token, A, B, "AFTER");

  console.log("\n> limit check: transferFrom(A, B, 121) sent by B (allowance left = 120)");
  try {
    await token.connect(B).transferFrom(A.address, B.address, unit(121));
    console.log("  unexpected: transaction succeeded");
  } catch (err) {
    console.log(`  reverted as expected: ${err.shortMessage || err.message}`);
  }

  await state(token, A, B, "FINAL STATE");
  console.log(`  totalSupply() = ${fmt(await token.totalSupply())} (unchanged)`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
