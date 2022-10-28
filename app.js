require("dotenv").config();

const { read_actions, execute_action } = require("./helpers/actions");
const { signIn } = require("./helpers/auth");
const { check_keys } = require("./helpers/check");

const main = async () => {
  // Checking keys
  if (!check_keys()) return;

  const signInResult = await signIn();
  if (!signInResult) return;

  // Openning actions file
  const actions = read_actions();

  // Traversing the actions
  for (action of actions) {
    execute_action(action);
  }
};

main();
