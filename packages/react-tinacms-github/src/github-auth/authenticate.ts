/**

Copyright 2019 Forestry.io Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import { GITHUB_AUTH_CODE_KEY } from './useGithubAuthRedirect'
import popupWindow from './popupWindow'
export const authenticate = (codeExchangeRoute: string): Promise<void> => {
  const authState = Math.random()
    .toString(36)
    .substring(7)

  const url = `https://github.com/login/oauth/authorize?scope=public_repo&client_id=${process.env.GITHUB_CLIENT_ID}&state=${authState}`

  return new Promise(resolve => {
    // @ts-ignore
    let authTab: Window | undefined
    window.addEventListener('storage', function(e: StorageEvent) {
      if (e.key == GITHUB_AUTH_CODE_KEY) {
        fetch(
          `${codeExchangeRoute}?code=${e.newValue}&state=${authState}`
        ).then(() => {
          if (authTab) {
            authTab.close()
          }
          resolve()
        })
      }
    })

    authTab = popupWindow(url, '_blank', window, 1000, 700)
  })
}
