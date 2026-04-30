export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  if (req.body.secret !== process.env.REVALIDATION_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    const { paths } = req.body;

    if (paths && Array.isArray(paths)) {
      // Revalidate all provided paths
      await Promise.all(paths.map((path) => res.revalidate(path)));
      return res.json({ revalidated: true, paths });
    }

    // Default revalidation if no paths provided
    await res.revalidate('/');
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating');
  }
}
