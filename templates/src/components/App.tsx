/**
 * @param props App props correspond to Hubspot "fields"
 */
export const App: React.FC = (props: Record<string, string>) => {
  console.log("App props (Hubspot fields):", props);
  return <div>Hubspot module generated with React</div>;
};
