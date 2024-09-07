# Frontend Setup Instructions

Follow the steps below to set up the frontend of the project.

## Step 0: Install NodeJS and Yarn

If this is your very first time using NodeJS and Yarn complete this step. Please ensure NodeJS is at least version 18.0.0.

For WSL and Linux, open a terminal and run:
```shell
sudo apt update
sudo apt install nodejs
sudo npm i -g yarn
```

For MacOS, open a terminal and run:
```shell
brew install node
brew install yarn
```

## Step 1: Install Dependencies

If you have newly cloned a project, open your terminal and navigate to the project's <b>frontend</b> directory. Then, run the following command to install the required dependencies using yarn and set up `./lint.sh`.

Run:
```shell
chmod +x ./lint.sh
yarn install
```

This command will download and install all the necessary packages and dependencies for the frontend and set up the linter.

## Step 2: Run ESLint

To lint the frontend code:

```shell
chmod +x ./lint.sh
./lint
```

This command will analyze your code and provide feedback on any syntax or style errors that need to be addressed. Make sure to fix any reported issues before proceeding. The first

## Step 3: Set up .env file

Navigate into the frontend folder from root and create a `.env` file. In the `.env` file paste the following with your specific API keys:
```shell
REACT_APP_BUCKET_NAME="REDACTED"
REACT_APP_BUCKET_REGION="REDACTED"
REACT_APP_BUCKET_IMAGE_ACCESS_URL="REDACTED"
REACT_APP_BUCKET_ENDPOINT="REDACTED"
REACT_APP_BUCKET_ACCESS_KEY_ID="REDACTED"
REACT_APP_BUCKET_SECRET_ACCESS_KEY="REDACTED"
REACT_APP_GOOGLE_PLACE_API_KEY="REDACTED"
REACT_APP_BACKEND_URL="REDACTED"
```


## Step 3: Start the Development Server

Once the ESLint check is complete and your code is error-free, you can start the development server by running the following command:

```shell
yarn start
```

This command will start the development server and launch your application. You should be able to access it by opening your web browser and navigating to `http://localhost:3000` or the specified URL provided by the development server.

If everything is set up correctly, you should see your application running in the browser.
