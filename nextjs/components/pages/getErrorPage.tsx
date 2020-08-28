import IndexPage from ".";

export default function ErrorPage(status) {
  switch (status) {
    case 404:
      return () => <IndexPage message="Oops! You have found a missing page." />;
  }
}
