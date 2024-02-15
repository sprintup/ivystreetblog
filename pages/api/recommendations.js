import { spawn } from 'child_process';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const pythonProcess = spawn('python', ['./utils/recommendationModel.py', JSON.stringify(req.body)]);
    
    pythonProcess.stdout.on('data', (data) => {
      res.status(200).json(JSON.parse(data));
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      res.status(500).json({ error: 'Error in recommendation model' });
    });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}