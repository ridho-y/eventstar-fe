import Compressor from 'compressorjs';
import moment from 'moment';
import { UploadFile2 } from 'pages/event/createEdit/UploadMedia';
import { S3 } from 'aws-sdk';

type preBookingInfoSections = {
  sectionName: string
  ticketsLeft: number
  cost: number
  reserve: string
  description: string
}

type reserves = {
  [key: string]: {
    sections: {
      sectionName: string
      quantity: number
    }[]
    cost: number
    description: string
  }
}

// Get reserves and sections in an object
export const getReservesAndSections = (preBookingInfoSections: preBookingInfoSections[]) => {
  let reserves: reserves = {};
  preBookingInfoSections.forEach(s => {
    if (reserves[`${s.reserve}`] !== undefined) {
      reserves[s.reserve].sections.push({
        sectionName: s.sectionName,
        quantity: s.ticketsLeft
      })
    } else {
      reserves[s.reserve] = { sections: [{ sectionName: s.sectionName, quantity: s.ticketsLeft }], cost: s.cost, description: s.description }
    }
  });
  return reserves
}

// Generate unique file name
export const generateUniqueFileName = (originalName: string) => {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName;
  return `${timestamp}-${randomString}XEVENTSTARX${extension}`;
};

export const uploadFiles = async (fileList: UploadFile2[]) => {
  const oldFiles = fileList.filter(f => f.originFileObj === undefined).map(j => j.url);
  const files = fileList.filter(f => f.originFileObj !== undefined).map(f => f.originFileObj);

  const newlyUploadedFiles: string[] = [];

  const s3 = new S3({
    s3ForcePathStyle: true,
    region: process.env.REACT_APP_BUCKET_REGION,
    endpoint: process.env.REACT_APP_BUCKET_ENDPOINT,
    credentials: {
      accessKeyId: process.env.REACT_APP_BUCKET_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_BUCKET_SECRET_ACCESS_KEY
    }
  });

  // Helper function to upload a single file
  const uploadFile = async (file: File): Promise<string> => {
    const compressedFile = await new Promise<File>((resolve, reject) => {
      new Compressor(file, {
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
        success: result => resolve(result as File),
        error: reject
      });
    });

    return new Promise<string>((resolve, reject) => {
      s3.upload({
        Bucket: process.env.REACT_APP_BUCKET_NAME,
        Key: generateUniqueFileName(compressedFile.name),
        Body: compressedFile,
        ContentType: compressedFile.type,
      }, (err, data) => {
        if (err) {
          console.error('Upload Error:', err);
          reject(err);
        } else {
          console.log('Upload Success');
          resolve(process.env.REACT_APP_BUCKET_IMAGE_ACCESS_URL + '/' + data.Bucket + '/' + data.Key);
        }
      });
    });
  };

  // Process each file upload in sequence
  for (const file of files) {
    try {
      const uploadUrl = await uploadFile(file);
      newlyUploadedFiles.push(uploadUrl);
    } catch (error) {
      console.error('Failed to upload:', error);
    }
  }

  return [...newlyUploadedFiles, ...oldFiles];
};

export const getFormattedType = (type: string) => {
  switch (type) {
    case "online":
      return "Online";
    case "inpersonSeated":
      return "Seated Venue";
    case "inpersonNonSeated":
      return "In-Person";
    default:
      return null;
  }
};

export const getFormattedDate = (date: string) => {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return `${formattedDate} at ${formattedTime}`;
};


export function findFirstURL(text: string): string | null {
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  const matches = text.match(urlRegex);
  if (matches && matches.length > 0) {
    return matches[0];
  }
  return null;
}

export function chatDateTime(dateTime: string) {
  const dt = moment(dateTime)
  let min = (dt.minute()).toString()
  while (min.length < 2) {
    min = '0' + min
  }

  if (dt.isSame(moment(), 'day')) {
    return `Today at ${dt.hour()}:${min}`;
  } else if (dt.isSame(moment().subtract(1, 'day'), 'day')) {
    return `Yesterday at ${dt.hour()}:${min}`;
  } else {
    return dt.format('HH:mm on DD/MM/YYYY')
  }
}