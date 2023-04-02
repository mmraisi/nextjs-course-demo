import Head from "next/head";
import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/meetupDetail";
import { Fragment } from "react";

const MeetupDetails = (props) => {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        address={props.meetupData.address}
        title={props.meetupData.title}
        description={props.meetupData.description}
      />
    </Fragment>
  );
};

export const getStaticPaths = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://mmraisi:Czd5L8g1pgK5bK8a@cluster-1.bpugdk4.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetupsIds = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: false,
    paths: meetupsIds.map((meetupId) => ({
      params: {
        meetupId: meetupId._id.toString(),
      },
    })),
  };
};

export const getStaticProps = async (context) => {
  // fetch the data for a single meet
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://mmraisi:Czd5L8g1pgK5bK8a@cluster-1.bpugdk4.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  const { _id, ...meetupWithoutId } = selectedMeetup;
  const meetupData = { id: _id.toString(), ...meetupWithoutId };

  return {
    props: {
      meetupData,
    },
  };
};

export default MeetupDetails;
