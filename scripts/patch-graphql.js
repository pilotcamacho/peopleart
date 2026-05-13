/**
 * Removes bundled graphql@15.10.1 copies from @aws-amplify packages.
 *
 * @aws-amplify/data-construct and @aws-amplify/graphql-api-construct both list
 * 'graphql' in their bundledDependencies, shipping a separate copy inside their
 * tarballs. npm overrides cannot affect bundledDependencies.
 *
 * Deleting those directories forces Node.js CJS resolution to fall back to the
 * single root graphql install, ensuring one GraphQLSchema class throughout the
 * CDK synthesis that runs during `ampx pipeline-deploy`.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'node_modules');

const bundledCopies = [
  path.join(root, '@aws-amplify', 'data-construct', 'node_modules', 'graphql'),
  path.join(root, '@aws-amplify', 'graphql-api-construct', 'node_modules', 'graphql'),
];

for (const target of bundledCopies) {
  try {
    if (!fs.existsSync(target)) continue;
    const stat = fs.lstatSync(target);
    if (stat.isSymbolicLink()) {
      fs.unlinkSync(target);
      console.log('graphql patch (removed symlink):', path.relative(root, target));
    } else {
      fs.rmSync(target, { recursive: true, force: true });
      console.log('graphql patch (removed dir):', path.relative(root, target));
    }
  } catch (e) {
    console.warn('graphql patch skipped for', target, ':', e.message);
  }
}
