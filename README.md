

# Sample code

**This repo contains sample code to help you get started with DAML. Please bear
in mind that it is provided for illustrative purposes only, and as such may not
be production quality and/or may not fit your use-cases. You may use the
contents of this repo in parts or in whole according to the BSD0 license:**

> Copyright © 2020 Digital Asset (Switzerland) GmbH and/or its affiliates
>
> Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.
>
> THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

# Marketplace

This is an initial example of how to setup a marketplace where digital tokens
can be issued and exchanged.

# Requirements
To run the marketplace locally or to build to be deployed on DABL, the following requirements are necessary:
1. DAML SDK (1.6)
2. `yarn` (1.22.x)
3. `poetry` (1.0.x)
4. `make` (3.x)
5. `yq` (3.x)

# Setup

In the root folder, run:
```
make package
```

This will build the bots, the DAML dar file, build the UI components, and automatically generate the TypeScript bindings.

Whenever the DAML model is changed, you must rebuild the DAR file and regenerate the TypeScript bindings.

This can be done by rebuilding the project using `make clean && make package`.

Alternatively, to only build the DAR file and regenerate the TypeScript bindings:
```
daml build
daml codegen js .daml/dist/da-marketplace-0.0.2.dar -o daml.js
cd ui
yarn install --force --frozen-lockfile
```

`yarn` will automatically rebuild components as they are changed while running, or you can build them manually with `yarn build`.

# Running

To run the sample app locally in the background using the Makefile, follow these steps:

```
# start the DAML server
make start_daml_server

# wait for the navigator to pop up...

# start all bots
make start_bots

# if you would like to use the included matching engine:
make start_matching_engine

# start the UI
cd ui
yarn start
```

This will spin up the DAML Sandbox, run the automation bots, and run a yarn server for the frontend.

The DAML Sandbox will automatically be bootstrapped with contracts from `daml/Setup.daml`.

If you would like to change which DAML Script file is run when the DAML Sandbox starts, you can modify the `init-script` field in `daml.yaml`.

To access the frontend, point your browser to `http://localhost:3000`. To view the DAML ledger state in the DAML Navigator, point your browser to `http://localhost:7500`.

To stop running background processes:
```
# stop the DAML server
make stop_daml_server

# stop all bots
make stop_bots

# if you are using the included matching engine:
make stop_matching_engine
```

Alternatively to running the DAML server in the background, `daml start` can be run in a separate terminal window.

Running the bots manually can be done with:
```
cd {bot_folder}
(DAML_LEDGER_URL=localhost:6865 poetry run python bot/{bot_name}_bot.py
```

## Running in DABL
These instructions will show you how to build and deploy the Marketplace to the DABL cloud service.

#### Build the DIT file
First, rebuild the project.
```
make clean && package
```

This will build the model, UI, and bots, as well as package the project in a `.dit` file which can be uploaded to DABL.

#### Create, upload and launch the project
Open http://projectdabl.com. Once you are logged in, click on "New Project"
![1_create_project](https://user-images.githubusercontent.com/71082197/98857327-ec817480-242c-11eb-9bfe-972dd5b7aa7b.png)

Next, enter a name and a ledger name for this project.
![2_name_project](https://user-images.githubusercontent.com/71082197/98857328-ec817480-242c-11eb-9d03-8e7a0f260dd1.png)

Once the project is created, click on the ledger in the project explorer. This will take you to the project's console.

Under the deployments tab, click on "Upload File" and upload the `da-marketplace-0.0.2.dit` file found in the `target` folder.
![3_upload_file](https://user-images.githubusercontent.com/71082197/98857330-ec817480-242c-11eb-8b07-4b0f88d3a39f.png)

When the file is uploaded, click "Launch" to deploy the project onto the ledger.
![4_click_launch](https://user-images.githubusercontent.com/71082197/98857332-ec817480-242c-11eb-956f-a2ceab185431.png)

#### Add the parties
Next, add the parties. Click on the "Live Data" tab, and first add the "Public" and "UserAdmin" parties by clicking the "Plus" next to their names.
![5_add_public](https://user-images.githubusercontent.com/71082197/98857333-ed1a0b00-242c-11eb-809a-a7a8a5e983ef.png)

Add the following parties by clicking the "+ Add Party" button: `Alice`, `Bob`, `Operator`, `Exchange`, `Broker`, `UsdtIssuer`, `BtcIssuer` and `Custodian`.
![6_add_parties](https://user-images.githubusercontent.com/71082197/98857334-ed1a0b00-242c-11eb-8f6a-4e385baca6f8.png)

#### Bootstrap with example data (optional)
Click the "Ledger Settings" tab, and download the `participants.json` file.
![7_participants](https://user-images.githubusercontent.com/71082197/98857335-ed1a0b00-242c-11eb-9074-ff3c9d3c32f3.png)

In your marketplace repo:
```
# creates a ledger_parties.json file that maps the DABL party IDs to party names
./create_ledger_parties.py path/to/participants.json path/to/ledger_parties.json`

# runs a DAML Script that adds all relevant information to the project ledger
daml script --participant-config participants.json --json-api --dar .daml/dist/da-marketplace-0.0.2.dar --script-name Setup:doSetup --input-file ledger-parties.json
```
If you would like to boostrap the marketplace with your own data, you can either change the `doSetup` function in `daml/Setup.daml`, or create your own setup function and change the `--script-name` to `MyModule:myFunction`.

#### Configure and deploy the bots
In the deployments tab, for each Automation bot:

Click the Automation bot.
![8_deploy_bot](https://user-images.githubusercontent.com/71082197/98857336-ed1a0b00-242c-11eb-83fb-55ae97833f81.png)

Add the configuration (the human readable name has no bearing on the functionality of the bot), and click launch.
![9_configure_bot](https://user-images.githubusercontent.com/71082197/98857337-edb2a180-242c-11eb-9e24-6b1d032963b9.png)

For the party to run as, use the following:
| Bot             | Party                 |
|-----------------|-----------------------|
| operator-bot    | UserAdmin             |
| matching-engine | Exchange              |
| exchange-bot    | Exchange              |
| custodian-bot   | Custodian             |
| broker-bot      | Broker                |
| issuer-bot      | UsdtIssuer, BtcIssuer |

For the `issuer-bot`, to configure a second deployment: after launching the first deployment select "Configure New Deployment".
![10_configure_new_deployment](https://user-images.githubusercontent.com/71082197/98857339-edb2a180-242c-11eb-923a-d0e8d180f12c.png)

#### View UI.

After all deployments are running, you can click the "View Site" button to visit the Marketplace UI.
![11_view_site](https://user-images.githubusercontent.com/71082197/98857340-edb2a180-242c-11eb-9989-55aafc66199f.png)
