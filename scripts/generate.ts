import {
  writeDocumentPartsToStream,
  validateApplicationJson,
  generate,
} from "@algorandfoundation/algokit-client-generator";
import fs from "fs";

import algoLotteryArc32Json from "../dist/FanbetAlgoLottery.arc32.json";
import discounterArc32Json from "../dist/FanbetDiscounter.arc32.json";
import lotteryArc32Json from "../dist/FanbetLottery.arc32.json";
import playerArc32Json from "../dist/FanbetPlayer.arc32.json";

async function main() {
  const algoLotteryJsonFromObject = validateApplicationJson(
    algoLotteryArc32Json,
    "../dist/FanbetAlgoLottery.arc32.json",
  );

  const lotteryJsonFromObject = validateApplicationJson(
    lotteryArc32Json,
    "../dist/FanbetLottery.arc32.json",
  );

  const playerJsonFromObject = validateApplicationJson(
    playerArc32Json,
    "../dist/FanbetPlayer.arc32.json",
  );

  const discounterJsonFromObject = validateApplicationJson(
    discounterArc32Json,
    "../dist/FanbetDiscounter.arc32.json",
  );

  const algoLotteryfileStream = fs.createWriteStream(
    "src/lib/contracts/FanbetAlgoLottery.ts",
    {
      flags: "w",
    },
  );
  writeDocumentPartsToStream(
    generate(algoLotteryJsonFromObject),
    algoLotteryfileStream,
  );

  const lotteryfileStream = fs.createWriteStream(
    "src/lib/contracts/FanbetLottery.ts",
    {
      flags: "w",
    },
  );

  writeDocumentPartsToStream(
    generate(lotteryJsonFromObject),
    lotteryfileStream,
  );

  const playerfileStream = fs.createWriteStream(
    "src/lib/contracts/FanbetPlayer.ts",
    {
      flags: "w",
    },
  );

  writeDocumentPartsToStream(generate(playerJsonFromObject), playerfileStream);

  const discounterfileStream = fs.createWriteStream(
    "src/lib/contracts/FanbetDiscounter.ts",
    {
      flags: "w",
    },
  );

  writeDocumentPartsToStream(
    generate(discounterJsonFromObject),
    discounterfileStream,
  );
}

main()
  .then(() => {
    console.log("Process completed");
  })
  .catch((e) => {
    console.error(e);
  });
