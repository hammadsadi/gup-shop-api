import app from "./app";
import config from "./app/config";

const main = () => {
  app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
  });
};

main();
