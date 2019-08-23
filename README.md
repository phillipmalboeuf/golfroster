Install xcode! (from the app store)
Make sure you've agreed to the terms. if not, it'll just ask you in terminal down the line and you can do it there.
Also make sure you've installed xcode command line tools.

Install cocoapods
`sudo gem install cocoapods`


Follow the steps here: https://facebook.github.io/react-native/docs/getting-started.html
(which are also below)

```
brew install node
brew install watchman
brew tap AdoptOpenJDK/openjdk
brew cask install adoptopenjdk8
```

```
npm install -g react-native-cli
```

Run the app!
`react-native run-ios`


Troubleshooting (things I ran into):
- You might run into some errors related to loading simulators when runnning `run-ios`. To resolve, have xcode open.
- During the brew installs, you might run into cocoa pods issues, but it shouldn't happen if you have cocoapods installed before you start the brew installs. If this happens, you can `cd` into the `ios` directory and run `pod install`


