import { promisify } from 'util'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = promisify(require('child_process').exec)

export const resetDatabase = async (): Promise<void> => {
  await exec('yarn migrate:dev:reset --force')
}
