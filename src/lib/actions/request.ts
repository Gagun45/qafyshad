"use server";

import { RequestMessages, SMTH_WENT_WRONG } from "../errors";
import { sendEmail } from "../helper";
import type { AuthResult, RequestDataType } from "../types";

const BODY_SIZE_LIMIT = 10; // NEXT.CONFIG.TS value !!! //

export const request = async (data: RequestDataType): Promise<AuthResult> => {
  try {
    const { name, contact, device, images } = data;
    if (
      name.length > 70 ||
      contact.length > 70 ||
      (device && device.length > 70)
    )
      return { success: false, message: RequestMessages.DATA_INVALID };
    const overallSize = images?.reduce(
      (acc, item) =>
        acc + parseFloat((item.file.size / (1024 * 1024)).toFixed(2)),
      0
    );
    if (overallSize && overallSize > BODY_SIZE_LIMIT)
      return { success: false, message: RequestMessages.SIZE_LIMIT_EXCEED };
    const subject = "New request";
    const html = `New request has been submitted!<br/>
    ----------------------------<br/>
    Information:<br/>
    Name: ${name}<br/>
    Contact: ${contact}<br/>
    Device: ${device ?? "Not specified"}<br/>
    ----------------------------<br/>
    `;
    const attachments = images?.map((image) => image.file);
    await sendEmail(
      process.env.WORK_EMAIL as string,
      subject,
      html,
      attachments
    );
    return { success: true, message: RequestMessages.SUCCESS_REQUEST };
  } catch {
    return { success: false, message: SMTH_WENT_WRONG };
  }
};
