import Head from "next/head";
import { Fragment } from "react";
import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";
("mongodb");

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
};

// export const getServerSideProps = (context) => {
//   // will run always on the server after deployment, never on the client
//   // this code only run on the server
//   // this works on every incoming request
//   const req = context.req;
//   const res = context.res;

//   // fetch data from API

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// };

export const getStaticProps = async () => {
  // this will never end up on teh client side, and never execute on the client side
  // because this code normally executed during the build process
  // this code will not be executed on the server nor the client side
  // this method is very good when I have static data that does not change much
  const client = await MongoClient.connect("");

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();
  // fetch data from API

  return {
    props: {
      meetups: meetups.map(({ _id, ...meetup }) => ({
        id: _id.toString(),
        ...meetup,
      })),
    },
    revalidate: 1, // number of seconds NextJs will wait till it regenerates new incoming requests
  };
  // this helps in SEO
};

export default HomePage;
