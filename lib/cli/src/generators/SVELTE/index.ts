import { getBabelDependencies, copyTemplate } from '../../helpers';
import { Generator } from '../Generator';

const generator: Generator = async (packageManager, npmOptions, { storyFormat }) => {
  const [
    storybookVersion,
    actionsVersion,
    linksVersion,
    addonsVersion,
    svelte,
    svelteLoader,
  ] = await packageManager.getVersions(
    '@storybook/svelte',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons',
    'svelte',
    'svelte-loader'
  );

  copyTemplate(__dirname, storyFormat);

  const packageJson = packageManager.retrievePackageJson();

  const babelDependencies = await getBabelDependencies(packageManager, packageJson);

  packageManager.addDependencies({ ...npmOptions, packageJson }, [
    `@storybook/svelte@${storybookVersion}`,
    `@storybook/addon-actions@${actionsVersion}`,
    `@storybook/addon-links@${linksVersion}`,
    `@storybook/addons@${addonsVersion}`,
    `svelte@${svelte}`,
    `svelte-loader@${svelteLoader}`,
    ...babelDependencies,
  ]);

  packageManager.addStorybookCommandInScripts();
};

export default generator;
