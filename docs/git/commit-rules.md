# Commit Rules

## Lokasi file

File ini harus di dalam repo (`sdn-2-kalimati/`) agar ter-track git.

## Sebelum commit

Cek commit terakhir untuk lihat pola message:
menggunakan bahasa inggris untuk menjelaskan deskripsinya

```bash
git log --oneline -1
```

## Format commit message

```
feat: implement Sprint 4 - Character Assessment Recap
feat: description for general features
fix: description for bug fixes
fix(attendance): description for scope-specific fixes
refactor: description for refactoring
chore: description for chores
```

## Wajib commit

Commit setiap kali selesai satu fitur / fix / refactor. Jangan tumpuk banyak perubahan dalam 1 commit.

## Commands

```bash
git add .
git commit -m "feat(frontend): deskripsi singkat"
git push
```
