import { getBabelDependencies, copyTemplate } from '../../helpers';
import { Generator } from '../Generator';
import { writePackageJson } from '../../js-package-manager';

const generator: Generator = async (packageManager, npmOptions, { storyFormat }) => {
  const [
    storybookVersion,
    actionsVersion,
    linksVersion,
    addonsVersion,
    latestRaxVersion,
  ] = await packageManager.getVersions(
    '@storybook/rax',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons',
    'rax'
  );

  copyTemplate(__dirname, storyFormat);

  const packageJson = packageManager.retrievePackageJson();

  const raxVersion = packageJson.dependencies.rax || latestRaxVersion;

  // in case Rax project is not detected, `rax` package is not available either
  packageJson.dependencies.rax = packageJson.dependencies.rax || raxVersion;

  // these packages are required for Welcome story
  packageJson.dependencies['rax-image'] = packageJson.dependencies['rax-image'] || raxVersion;
  packageJson.dependencies['rax-link'] = packageJson.dependencies['rax-link'] || raxVersion;
  packageJson.dependencies['rax-text'] = packageJson.dependencies['rax-text'] || raxVersion;
  packageJson.dependencies['rax-view'] = packageJson.dependencies['rax-view'] || raxVersion;

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(packageManager, packageJson);

  packageManager.addDependencies({ ...npmOptions, packageJson }, [
    `@storybook/rax@${storybookVersion}`,
    `@storybook/addon-actions@${actionsVersion}`,
    `@storybook/addon-links@${linksVersion}`,
    `@storybook/addons@${addonsVersion}`,
    ...babelDependencies,
  ]);

  packageManager.addStorybookCommandInScripts();
};

export default generator;
