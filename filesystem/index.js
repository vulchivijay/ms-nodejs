const fs = require("fs").promises;
const path = require("path");

async function main() {
  const salesDir = path.join(__dirname, "stores");
  const salesTotalDir = path.join(__dirname, "salesTotals");

  // create the salestotal directory if it does not exit;
  try {
    await fs.mkdir(salesTotalDir);
  } catch {
    console.log(`${salesTotalDir} already exists.`);
  }

  // find paths to all the sales files
  const saleFiles = await findSalesFiles(salesDir);
  const salesTotal = await calculateSalesTotal(saleFiles);

  const report = {
    salesTotal,
    totalStores: saleFiles.length
  };

  const reportPath = path.join(salesTotalDir, "reports.json");

  try {
    await fs.unlink(reportPath);
  } catch {
    console.log(`Failed to remove ${reportPath}`);
  }

  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`Sales report written to ${salesTotalDir}`);

}

main();

async function findSalesFiles (folderName) {
  let salesFiles = [];

  const items = await fs.readdir(folderName, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      salesFiles = salesFiles.concat(
        await findSalesFiles(path.join(folderName, item.name))
      );
    } else {
      if (path.extname(item.name) === ".json") {
        salesFiles.push(path.join(folderName, item.name));
      }
    }
  }

  return salesFiles;
}

async function calculateSalesTotal (salesFiles) {
  let salesTotal = 0;
  for (let file of salesFiles) {
    const data = JSON.parse(await fs.readFile(file));
    salesTotal += data.total;
  }
  return salesTotal;
}