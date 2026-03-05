export default function Challenges() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to GitSim!</h1>
      <p className="text-sm text-slate-700">
        This tool is designed to get you familliar with using basic shell commands, and learning how to safely work within a Git based repository.
        The terminal on the right is your playground, and the browser on the left is your guide.
        You can click around in the browser to learn about different concepts, and then try them out in the terminal.
        Don't worry about breaking anything - you can always reset the terminal to start fresh. Happy coding!
      </p>

      <br />

      <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
      <p className="text-sm text-slate-700">
        If you're new to the command line, we recommend starting with the Glossary tab to familiarize yourself with common commands and concepts.
        Once you're comfortable, you can move on to the Challenges where you'll find a series of exercises designed to test your knowledge and help you practice your skills.
        Each challenge will have a description of the task you need to accomplish, and you can use the terminal to execute the necessary commands.
        Don't worry if you get stuck - you can always refer back to the Glossary or reset the terminal to try again. Good luck!
      </p>

      <h2 className="text-xl font-semibold mb-2 mt-6">Challenges</h2>

      {/* Challenge Cards */}
      <div className="grid gap-4">
        <div className="bg-slate-100 p-4 rounded-md border border-slate-300">
          <h3 className="text-lg font-semibold mb-2">Challenge 1: Basic Navigation</h3>
          <p className="text-sm text-slate-700">
            Use the <code className="bg-slate-200 px-1 rounded">ls</code> and <code className="bg-slate-200 px-1 rounded">cd</code> commands to navigate through the directory structure and list the contents of each directory.
          </p>
        </div>

        <div className="bg-slate-100 p-4 rounded-md border border-slate-300">
          <h3 className="text-lg font-semibold mb-2">Challenge 2: Git Basics</h3>
          <p className="text-sm text-slate-700">
            Initialize a new Git repository, create a new file, stage it, and commit your changes. Then, create a new branch and switch to it.
          </p>
        </div>

        <div className="bg-slate-100 p-4 rounded-md border border-slate-300">
          <h3 className="text-lg font-semibold mb-2">Challenge 3: Remote Repositories</h3>
          <p className="text-sm text-slate-700">
            Add a remote repository, push your local commits to the remote, and then pull any changes from the remote back to your local repository.
          </p>
        </div>
      </div>
    </div>
  );
}
