# DZEIO dotfiles 😄

Create and manage your dotfiles simply using the binary

```
yarn global add @dzeio/dotfiles
dotfiles
```

and follow the software 💃

## Modules

Each Programs are modules so you can simply add new modules in the `modules/` folder.

a Future update will allllow to add external modules via `yarn`/`npm`

```
Dzeio dotfiles
Initial installation:
- Initialize empty // install the default files in $config/.config/dzeio-dotfiles
- Restore from git Repository (git **MUST** be installed on the system) // clone the repository in the folder
```

```
Dzeio Main Menu:
- Save
- Restore
- Options
- Exit
```

```
Dzeio Save/Restore Menu:
- Quick save
- Manual save
```

## Build it 🥇


run the following
```bash
yarn
```

next you will have to change the file node_modules/enquirer/index.d.ts to [this](https://raw.githubusercontent.com/enquirer/enquirer/a128486736e20b439599d438ede2d92be737cadd/index.d.ts) else Typescript will show errors

finnally run

```bash
yarn build
```

and you will be able to launch it from `dist/cjs/cli.js`
