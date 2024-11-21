<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./docs/images/logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./docs/images/logo-light.svg">
    <img alt="Cloud Vision Toolkit logo" img width="460" src="/docs/images/logo-light.svg">
  </picture>
</p>

## Vision Toolkit

The Vision Toolkit, developed by the AU / UK Vision team, is a graph flow-based editor that streamlines vision code development. Users can dynamically update code by dragging and connecting nodes, seeing changes in real time. Integrated with TwinCAT Native, it offers an intuitive, efficient toolset for rapid development and visualization, suitable for all skill levels.

The vision toolkit is a project in two parts. The TwinCAT project is referred to as the backend, and the TwinCAT HMI project, known as the frontend.

## Screenshot

![image](./docs/images/Screenshot.gif)

## Getting started

### Clone the repo

```
git clone https://github.com/VisionToolkit-Dev-Team/vision-toolkit
```

### TwinCAT (backend)

1. Check you have installed the following

   - TwinCAT XAE 4024.62 (minimum)
   - TwinCAT Vision 4.0.5.10 (minimum)

2. Open, activate and run the TwinCAT project `\src\twincat\vision-toolkit.sln`.

If you are missing any of the mobject-libraries, then simply right click on the project and select "Install Project Library (unknown versions)"

3. Open the vision-toolkit-hmi in the solution tree
4. Start live view

## Getting started walkthrough

![image](./docs/images/GettingStarted.gif)

## Devtools

These are only required if you are activly developing mobject npm packages. They are a set of tools to help keep the TwinCAT HMI Project updated. They are just time saving tools.

### Installation

Before you can use the devtools you must have node.js installed and have run the following command

```bash
npm install
```

### Update NPM Dependencies

This command will fetch the latest dependencies from NPM and place them in the correct TwinCAT HMI import folder.

```bash
npm run update
```

Please note, not all files are copied from the NPM packages. The list of files copied is maintained here. `./devtools/file-paths.json`

## License

vision-toolkit is MIT licensed. For more details, see the LICENSE file in the repository.

## Third-Party Assets

vision-toolkit contains 3rd party licenses. License information can be found in the relevant source files within `.\src\twincat\vision-toolkit-hmi\Imports`. Please check all files for license requirements.
