const { Base64 } = require("js-base64");
console.log(
    Base64.decode(
        "eyJFYlVzZXJJZCI6MTAwMDEwNDEsIlVzZXJOYW1lIjoieGtsMTMxIiwiQWNjb3VudElkIjoyMDYzOTAzNDI5LCJBY2Nlc3NUb2tlbiI6IjdGOTM4QjIwNUY4NzZGQzNGREZFMTY3NzE1QzgxRTkyM0MxOTZCN0ZCOUU4MjlFNzhEQTE4ODlCOTFCOThBMDdCNDlCQ0IyNUFCN0JBNTkxMDdFQkQzQzU4QzA1NDIzQyIsIk1hY0tleSI6IlN6Q2lQVWpBZTEiLCJUaW1lU3RhbXAiOi0yNjcwLCJBY2NvdW50VHlwZSI6IkVkYm94IiwiQWNjZXNzIjoyLCJMYW5ndWFnZSI6IlNpbXBsaWZpZWRDaGluZXNlIn0%3D"
    )
);
console.log(
    Base64.decode(
        decodeURIComponent(
            "%3DeyJFYlVzZXJJZCI6MTAwMDEwNDEsIlVzZXJOYW1lIjoieGtsMTMxIiwiQWNjb3VudElkIjoyMDYzOTAzNDI5LCJBY2Nlc3NUb2tlbiI6IjdGOTM4QjIwNUY4NzZGQzNGREZFMTY3NzE1QzgxRTkyM0MxOTZCN0ZCOUU4MjlFNzA2NEQ5QjFCNjIwQjEyMzIwMDBFQkE0N0JCNTNBREIxMkUzODQyMTI3Q0MyMTM4QyIsIk1hY0tleSI6IjJOWmdSZklWaVQiLCJUaW1lU3RhbXAiOi0yMDIxLCJBY2NvdW50VHlwZSI6IkVkYm94IiwiQWNjZXNzIjoyLCJMYW5ndWFnZSI6IlNpbXBsaWZpZWRDaGluZXNlIn0%253D"
        )
    )
);
console.log(
    Base64.decode(
        "eyJFYlVzZXJJZCI6MTAwMDA4MzYsIlVzZXJOYW1lIjoieGtsMTMxIiwiUmVhbE5hbWUiOiIiLCJBY2NvdW50SWQiOjIwNjM5MDM0MjksIkFjY2Vzc1Rva2VuIjoiN0Y5MzhCMjA1Rjg3NkZDM0ZERkUxNjc3MTVDODFFOTIzQzE5NkI3RkI5RTgyOUU3MjAyM0U1QzM1OEE3MTI1N0MwMEUxNDFDNTExQkNDRjBDRjEwQUE4NkMxNDE2MkNEIiwiTWFjS2V5IjoicUpmTGpIb3VhZCIsIlRpbWVTdGFtcCI6LTgzLCJBY2NvdW50VHlwZSI6IkVkYm94IiwiQWNjZXNzIjoxLCJHYW1lSWQiOiI0YTI0YmU4MC1mNTU4LTExZTktOTdjZi00ZGRkYzcwMjVkYWIiLCJWZXJzaW9uIjoiMS4wMCIsIkxhbmd1YWdlIjoiU2ltcGxpZmllZENoaW5lc2UiLCJBcmVhIjoiQ0hOIiwiQ2hhbm5lbCI6IkRlZmF1bHQifQ%3D%3D"
    )
);
console.log(
    Base64.decode(
        "eyJFYlVzZXJJZCI6MTAwMDA4MzYsIlVzZXJOYW1lIjoieGtsMTMxIiwiUmVhbE5hbWUiOiIiLCJBY2NvdW50SWQiOjIwNjM5MDM0MjksIkFjY2Vzc1Rva2VuIjoiN0Y5MzhCMjA1Rjg3NkZDM0ZERkUxNjc3MTVDODFFOTIzQzE5NkI3RkI5RTgyOUU3MDUwODVEODZBNjk2MjQ3MDFEQjNCQ0U2NkU4QUMwMDgyRTE5RDU0QTQ3MkNCODVCIiwiTWFjS2V5IjoiNHh3cktKWVcxZiIsIlRpbWVTdGFtcCI6MjAsIkFjY291bnRUeXBlIjoiRWRib3giLCJBY2Nlc3MiOjEsIkdhbWVJZCI6IjAwMWQwY2UwLTAxNDAtMTFlYS05ZmYwLTMzZjhmMTIwZTQ1MSIsIkxhbmd1YWdlIjoiU2ltcGxpZmllZENoaW5lc2UiLCJBcmVhIjoiQ0hOIiwiQ2hhbm5lbCI6IkRlZmF1bHQifQ%3D%3D"
    )
);
