# GitHub Upload Guide - Step by Step

## Prerequisites

You need:
- A GitHub account (create one at https://github.com if you don't have)
- Git configured on your computer

## Step 1: Configure Git (One-time setup)

Open VS Code terminal and run these commands with YOUR information:

```bash
# Set your name (replace with your actual name)
git config --global user.name "Your Name"

# Set your email (use your GitHub email)
git config --global user.email "your-email@example.com"
```

Example:
```bash
git config --global user.name "Kranti Kumar"
git config --global user.email "kranti@example.com"
```

## Step 2: Verify Git Configuration

```bash
# Check your configuration
git config --list
```

You should see your name and email.

## Step 3: Make Your First Commit

```bash
# Stage all files
git add .

# Commit with a message
git commit -m "Initial commit: QueryCopilot NL2SQL UI"
```

## Step 4: Create GitHub Repository

### Option A: Using GitHub Website (Recommended)

1. Go to https://github.com
2. Click the **"+"** icon in the top right
3. Select **"New repository"**
4. Fill in:
   - **Repository name:** `querycopilot-ui` (or your preferred name)
   - **Description:** "Enterprise Natural Language to SQL UI for Snowflake, PostgreSQL, MySQL, and Databricks"
   - **Public** or **Private** (your choice)
   - **DO NOT** check "Initialize with README" (we already have one)
5. Click **"Create repository"**

### Option B: Using GitHub CLI (if installed)

```bash
# Install gh if not installed
# For Linux: sudo apt install gh
# For Mac: brew install gh

# Login to GitHub
gh auth login

# Create repository
gh repo create querycopilot-ui --public --source=. --remote=origin --push
```

## Step 5: Connect Local Repository to GitHub

After creating the repository on GitHub, you'll see instructions. Run:

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/querycopilot-ui.git

# Rename branch to main (if needed)
git branch -M main

# Push code to GitHub
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/kranti/querycopilot-ui.git
git branch -M main
git push -u origin main
```

## Step 6: Enter GitHub Credentials

When you push, Git will ask for credentials:

- **Username:** Your GitHub username
- **Password:** Use a Personal Access Token (NOT your GitHub password)

### How to Create a Personal Access Token:

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: "QueryCopilot Upload"
4. Select scopes: Check **"repo"** (full control of private repositories)
5. Click **"Generate token"**
6. **COPY THE TOKEN** (you won't see it again!)
7. Use this token as your password when pushing

## Step 7: Verify Upload

1. Go to https://github.com/YOUR_USERNAME/querycopilot-ui
2. You should see all your files!

## Future Updates

After the initial upload, to push new changes:

```bash
# Make changes to your code
# ...

# Stage changes
git add .

# Commit with a message
git commit -m "Update: Description of changes"

# Push to GitHub
git push
```

## Common Issues & Solutions

### Issue 1: Authentication Failed

**Solution:** Use a Personal Access Token instead of password (see Step 6)

### Issue 2: Remote Already Exists

```bash
# Remove existing remote
git remote remove origin

# Add it again with correct URL
git remote add origin https://github.com/YOUR_USERNAME/querycopilot-ui.git
```

### Issue 3: Push Rejected

```bash
# Pull first, then push
git pull origin main --allow-unrelated-histories
git push origin main
```

## Quick Reference Commands

```bash
# Check status
git status

# View commit history
git log --oneline

# View remote URL
git remote -v

# Create and switch to new branch
git checkout -b feature-name

# Switch back to main
git checkout main

# Pull latest changes
git pull origin main
```

## Repository Settings (After Upload)

### Add Topics/Tags
On your GitHub repo page:
1. Click **"Add topics"**
2. Add: `natural-language-processing`, `sql`, `typescript`, `react`, `snowflake`, `postgresql`, `mysql`, `databricks`

### Add Description
Edit the description at the top of your repo page

### Enable GitHub Pages (Optional)
Settings → Pages → Deploy from branch → Select `main` and `/docs` or root

## What's Already Included

Your repository includes:
- ✅ Complete source code
- ✅ README.md with usage instructions
- ✅ DEPLOYMENT.md with deployment guides
- ✅ CONTRIBUTING.md for contributors
- ✅ LICENSE (MIT)
- ✅ .gitignore (properly configured)
- ✅ package.json with all dependencies

## Next Steps

1. Add a repository description on GitHub
2. Add topics/tags for discoverability
3. Consider adding screenshots to README
4. Set up GitHub Actions for CI/CD (optional)
5. Enable issue templates (optional)

## Need Help?

- GitHub Docs: https://docs.github.com
- Git Documentation: https://git-scm.com/doc
- Contact GitHub Support: https://support.github.com

---

**Ready to upload?** Follow the steps above in order!
