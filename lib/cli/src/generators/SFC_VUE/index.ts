import { getBabelDependencies, copyTemplate } from '../../helpers';
import { StoryFormat } from '../../project_types';
import { Generator } from '../Generator';

const generator: Generator = async (packageManager, npmOptions, { storyFormat }) => {
  const packages = [
    '@storybook/vue',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons',
  ];
  if (storyFormat === StoryFormat.MDX) {
    packages.push('@storybook/addon-docs');
  }
  const versionedPackages = await packageManager.getVersionedPackages(...packages);

  copyTemplate(__dirname, storyFormat);

  const packageJson = packageManager.retrievePackageJson();

  const babelDependencies = await getBabelDependencies(packageManager, packageJson);

  packageManager.addDependencies({ ...npmOptions, packageJson }, [
    ...versionedPackages,
    ...babelDependencies,
  ]);

  packageManager.addStorybookCommandInScripts();
};

export default generator;
