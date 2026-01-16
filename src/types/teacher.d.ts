export type TeacherRequestBody = Request & {
    name : string,
    jabatan:string,
    nip:string | null,
    // image_url:string
    mata_pelajaran: string | null,
    major_id: string | null
}
