-- 입점 상담 신청 (랜딩 폼 → ownerApplications Firestore 스키마와 동일)

create table if not exists public.owner_applications (
  id uuid primary key default gen_random_uuid(),
  store_name text not null,
  business_type text not null,
  location text not null,
  manager_name text not null,
  phone text not null,
  source text not null default 'landing',
  status text not null default 'new'
    check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

comment on table public.owner_applications is '리필링크 랜딩 입점 상담 신청';
comment on column public.owner_applications.source is '유입 경로 (예: landing)';
comment on column public.owner_applications.status is '처리 상태: new | contacted | closed';

create index if not exists owner_applications_created_at_idx
  on public.owner_applications (created_at desc);

create index if not exists owner_applications_status_idx
  on public.owner_applications (status);

alter table public.owner_applications enable row level security;

-- 랜딩에서 신청만 허용 (조회/수정/삭제는 서비스 롤·대시보드에서)
create policy "Public can insert owner applications"
  on public.owner_applications
  for insert
  to anon, authenticated
  with check (
    char_length(trim(store_name)) > 0
    and char_length(trim(business_type)) > 0
    and char_length(trim(location)) > 0
    and char_length(trim(manager_name)) > 0
    and char_length(regexp_replace(phone, '\D', '', 'g')) >= 9
    and source = 'landing'
    and status = 'new'
  );
