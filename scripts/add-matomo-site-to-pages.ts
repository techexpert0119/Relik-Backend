import 'dotenv/config'
import { MongoClient, ServerApiVersion } from 'mongodb'

import { PageStatus } from '../src/modules/page/enums/page-status'
import { Matomo } from '../src/lib/matomo'

async function main () {
  // Matomo
  const matomo = new Matomo({
    matomoBaseUrl: process.env.MATOMO_BASE_URL,
    authToken: process.env.MATOMO_AUTH_TOKEN,
  })

  // Mongo
  const databaseName = 'relik'
  const pagesCollectionName = 'pages'

  const client = new MongoClient(process.env.DATABASE_URL_MAIN, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  })
  const pagesCollection = client.db(databaseName).collection(pagesCollectionName)

  try {
    await client.connect()
  } catch (err) {
    throw new Error(`Error connecting to MongoDB: ${err}`)
  }
  try {
    await client.db('admin').command({ ping: 1 })
  } catch (err) {
    throw new Error(`Error pinging MongoDB: ${err}`)
  }

  const pages = await pagesCollection
    .find({
      status: PageStatus.ACTIVE,
      mSiteId: { $exists: false }
    })
    .toArray()
  for (const page of pages) {
    console.log(page)

    let createSiteRes
    try {
      createSiteRes = await matomo.CreateSite({
        siteName: `Relik - ${page.pageName}`,
      })
    } catch (err) {
      console.error(`Error creating site for ${page._id.toString()}: ${err}`)
      continue
    }
    console.debug('createSiteRes:', createSiteRes)

    let updateRes
    try {
      updateRes = await pagesCollection.updateOne({
        _id: page._id
      }, {
        $set: {
          mSiteId: createSiteRes.value
        }
      })
    } catch (err) {
      console.error(`Error updating page ${page._id.toString()}: ${err}`)
      continue
    }
    console.debug('updateRes:', updateRes)
  }

  await client.close()
}

main()
  .catch(console.error)
