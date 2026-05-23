import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  console.log("Mengecek Method IDs untuk kontrak DocumentRegistry...");

  const Contract = await ethers.getContractFactory("DocumentRegistry");
  const interface_ = Contract.interface;

  console.log("\nMethod IDs (Function Selectors):");
  console.log("--------------------------------");

  interface_.forEachFunction((fragment) => {
    const selector = fragment.selector;
    console.log(`${fragment.name.padEnd(25)} | ${selector} | ${fragment.format()}`);
  });

  console.log("--------------------------------\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
