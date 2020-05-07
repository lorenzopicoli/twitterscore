require('dotenv').config()

import { run } from './lib/bin'

run().catch((e) => console.log(e))
