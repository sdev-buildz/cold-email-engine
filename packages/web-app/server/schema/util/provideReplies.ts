import { initDb } from '@packages/db'
import type { Models } from '@packages/db/types'
import type { Prospect } from '../../util/types'
import { editEmailXmls } from './editEmail'

/** DB client */
const db = initDb()

/**
 * Stimulates replies from prospects
 */
export const provideReplies = async () => {
  const convMetrics = await db.orm.public.ConversionMetrics.where({}).first()
  if (!convMetrics) throw new Error('seed the db')

  const activeProspects = await db.orm.public.Prospect.where({
    isDeactivated: false,
  }).all()
  const activeCount = activeProspects.length
  console.log('convMetrics =', convMetrics)
  console.log('activeCount =', activeCount)

  const bounce = Math.floor((activeCount * convMetrics.bounceRate) / 100)
  const ignore = Math.floor((activeCount * convMetrics.ignoreRate) / 100)
  const unsubscribe = Math.floor(
    (activeCount * convMetrics.unsubscribeRate) / 100
  )
  const notInterested = Math.floor(
    (activeCount * convMetrics.notInterested) / 100
  )
  const ooo = Math.floor((activeCount * convMetrics.oooRate) / 100)
  const meeting = Math.floor((activeCount * convMetrics.meetingRate) / 100)
  const interested = Math.floor((activeCount * convMetrics.interested) / 100)
  const referral = Math.floor((activeCount * convMetrics.referralRate) / 100)

  console.log(
    bounce,
    unsubscribe,
    notInterested,
    ooo,
    meeting,
    interested,
    referral
  )

  /** Batching replies to be sent to the OpenRouter model */
  const replies: Record<Prospect['id'], { body: string; subject: string }> = {}

  let i = 0
  for (; i < bounce; i += 1) {
    const prospect = activeProspects[i]!
    await db.orm.public.Prospect.where({ id: prospect.id }).update({
      status: 'bounced',
      isDeactivated: true,
    })
  }
  let j = i + unsubscribe
  for (; i < j; i += 1) {
    const prospect = activeProspects[i]!
    await db.orm.public.Prospect.where({ id: prospect.id }).update({
      status: 'unsubscribed',
      isDeactivated: true,
    })
  }
  const makeReplies = async (
    count: number,
    intent: Models.public_ReplyEmails['intent']
  ) => {
    const emailTemplate = await db.orm.public.ReplyEmails.where({
      intent,
    }).first()
    if (!emailTemplate) {
      console.log('no email template for intent =', intent)
      return
    }
    j = i + count
    for (; i < j; i += 1) {
      const prospect = activeProspects[i]!

      const email = editEmailXmls(emailTemplate, prospect)
      replies[prospect.id] = email

      //    It currently mocks OpenRouter step.
      await db.orm.public.Prospect.where({ id: prospect.id }).update({
        status: 'replied',
        replyIntent: intent,
        isDeactivated: true,
      })
    }
  }

  //    'Not interested' replies
  await makeReplies(notInterested, 'not_interested')

  //    'out_of_office' replies
  await makeReplies(ooo, 'out_of_office')

  //    'meeting_scheduled' replies
  await makeReplies(meeting, 'meeting_scheduled')

  //    'interested' replies
  await makeReplies(interested, 'interested')

  //    'referral' replies
  await makeReplies(referral, 'referral')
}
