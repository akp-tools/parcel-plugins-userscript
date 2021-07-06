import ThrowableDiagnostic from "@parcel/diagnostic";
import { Optimizer } from '@parcel/plugin';
import { blobToString } from '@parcel/utils';
import { PackageJSON } from '@parcel/types';

import { promises as fs } from 'fs';
import path from 'path';

interface PluginOptions {
  userscriptHeader?: string;
  version?: string;
}

export default (new Optimizer<PluginOptions>({
  async loadConfig({ config, options }) {
    const userConfig = await config.getConfigFrom<PluginOptions>(
      path.join(options.entryRoot, 'index'),
      ['.userscriptrc', '.userscriptrc.js'],
      { packageKey: '@akp-tools/parcel-optimizer-userscript' }
    );

    const pkg = await config.getConfigFrom<PackageJSON>(
      path.join(options.entryRoot, 'index'),
      ['package.json'],
      { packageKey: '@akp-tools/parcel-optimizer-userscript' }
    );

    if (userConfig) {
      let isJavascript = path.extname(userConfig.filePath) === '.js';
      if (isJavascript) {
        config.invalidateOnStartup();
      }
    }

    const contents = userConfig?.contents ?? {};

    Object.assign(contents, { version: pkg?.contents?.version ?? 'no-version' });

    return contents;
  },

  async optimize({ config, contents, map }) {
    let code = await blobToString(contents);

    // if the userscriptHeader config exists, let's find and add it.
    try {
      if (config?.userscriptHeader) {
        const header = await (await fs.readFile(config.userscriptHeader)).toString('utf-8');
        const preparedHeader = header.replace(/{{ version }}/g, config.version);

        code = `${preparedHeader}\n${code}`;
      } else {
        throw new ThrowableDiagnostic({
          diagnostic: {
            message: 'No userscript header found!',
            hints: [
              "Make sure you create a .userscriptrc file and use it to specify your header!",
            ],
          },
        });
      }
    } catch {
      throw new ThrowableDiagnostic({
          diagnostic: {
            message: 'Specified userscript header not found!',
            hints: [
              "Make sure the header file specified in .userscriptrc exists!",
            ],
          },
        });
    }

    return { contents: code, map }
  },
}));
