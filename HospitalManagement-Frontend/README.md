                         HOST MACHINE
                    ┌───────────────────────┐
                    │                       │
                    │   Browser             │
                    │      │                │
                    │      ↓                │
                    │ localhost:3000        │
                    │      │                │
                    └──────┼────────────────┘
                           │
                    Docker Network
                           │
              ┌────────────┴────────────┐
              │                         │
              ↓                         │
       ┌──────────────┐                 │
       │   frontend   │                 │
       │    Nginx     │                 │
       │     :80      │                 │
       └──────┬───────┘                 │
              │                         │
              │ backend:8080            │
              ↓                         │
       ┌──────────────┐                 │
       │   backend    │                 │
       │ Spring Boot  │                 │
       │    :8080     │                 │
       └──────┬───────┘                 │
              │                         │
              │ mysql:3306              │
              ↓                         │
       ┌──────────────┐                 │
       │    mysql     │                 │
       │    :3306     │                 │
       └──────────────┘                 │
              │
              ↓
        mysql-data volume


Full Multi-Container Architecture