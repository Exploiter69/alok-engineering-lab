# Admin Recovery

The admin is a convenience/control plane, not the source of truth.

If the admin is unavailable:

1. Create a branch from `master`.
2. Edit the relevant Markdown/MDX files under `src/content/`.
3. Run:
   ```bash
   npm run validate
   astro check
   npm run build
   npm run audit
   npm run audit:performance
   ```
4. Review `git diff`.
5. Push the branch.
6. Wait for GitHub Actions Quality to pass.
7. Open/review the PR and merge normally.
8. Verify the resulting Vercel production deployment.

For a rollback, revert the offending merge commit with a new commit. Never rewrite history.

The repository remains the recovery mechanism even when the admin is completely down.
