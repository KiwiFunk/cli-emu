export default function AzureEmptyView({ openForm }: { openForm: () => void }) {
  return <div className="p-8 text-white">Empty. <button onClick={openForm}>Create</button></div>;
}
