import path from 'path';
import fs from 'fs';
import { getBabelDependencies, copyTemplate } from '../../helpers';
import { StoryFormat } from '../../project_types';
import { Generator } from '../Generator';

const generator: Generator = async (packageManager, npmOptions, { storyFormat }) => {
  const packages = [
    '@storybook/react',
    '@storybook/preset-create-react-app',
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

  packageManager.addStorybookCommandInScripts({
    port: 9009,
    staticFolder: fs.existsSync(path.resolve('./public')) ? 'public' : undefined,
  });
};

export default generator;
