-- Script SQL para banco de dados do Casamento (Supabase / PostgreSQL)

-- Habilitar a extensão uuid-ossp (se necessário para IDs únicos)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA: wedding_info
-- Contém as configurações do casamento. Possui uma restrição para garantir
-- apenas um único registro com ID=1 (padrão single-row).
CREATE TABLE IF NOT EXISTS public.wedding_info (
    id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    noiva_name text NOT NULL DEFAULT 'Letielly',
    noivo_name text NOT NULL DEFAULT 'Wenderson',
    wedding_date text NOT NULL DEFAULT '2026-11-14',
    wedding_time text NOT NULL DEFAULT '16:30',
    venue_name text NOT NULL DEFAULT 'Mansão Rosewood',
    venue_address text NOT NULL DEFAULT 'Alameda das Capelas, 1200 - Vale do Sol',
    venue_city text NOT NULL DEFAULT 'Vale do Paraíba, SP',
    venue_map_url text NOT NULL DEFAULT 'https://maps.google.com/?q=Mansao+Rosewood+Vale+do+Paraiba',
    our_story text NOT NULL DEFAULT '',
    our_story_image_url text NOT NULL DEFAULT '',
    pix_key text NOT NULL DEFAULT '',
    pix_holder text NOT NULL DEFAULT '',
    admin_pin text NOT NULL DEFAULT '1234',
    has_banner_image boolean NOT NULL DEFAULT true,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 2. TABELA: gifts
-- Lista de presentes. Os IDs podem ser strings (ex: 'gift-1') ou UUIDs.
CREATE TABLE IF NOT EXISTS public.gifts (
    id text PRIMARY KEY,
    name text NOT NULL,
    price numeric NOT NULL,
    category text NOT NULL,
    image_url text NOT NULL,
    status text NOT NULL DEFAULT 'disponivel', -- 'disponivel' ou 'comprado'
    buyer_name text,
    buyer_email text,
    purchased_at text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 3. TABELA: rsvps
-- Lista de confirmações de presença dos convidados.
CREATE TABLE IF NOT EXISTS public.rsvps (
    id text PRIMARY KEY,
    name text NOT NULL,
    phone text NOT NULL,
    confirmed boolean NOT NULL DEFAULT false,
    num_guests integer NOT NULL DEFAULT 0,
    message text,
    diet_restrictions text,
    created_at text NOT NULL,
    db_created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 4. TABELA: purchases
-- Histórico de transações de presentes (PIX ou cartão simulação).
CREATE TABLE IF NOT EXISTS public.purchases (
    id text PRIMARY KEY,
    gift_id text,
    gift_name text NOT NULL,
    amount numeric NOT NULL,
    buyer_name text NOT NULL,
    buyer_email text NOT NULL,
    payment_method text NOT NULL, -- 'pix' ou 'card'
    paid_at text NOT NULL,
    status text NOT NULL DEFAULT 'aprovado'
);

-- 5. TABELA: notifications
-- Log de notificações enviadas.
CREATE TABLE IF NOT EXISTS public.notifications (
    id text PRIMARY KEY,
    type text NOT NULL, -- 'rsvp', 'purchase_buyer', 'purchase_couple'
    recipient text NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    sent_at text NOT NULL
);

-- 6. TABELA: supabase_heartbeat
-- Utilizada unicamente pela automação do GitHub Actions no ping para impedir inatividade do Supabase.
CREATE TABLE IF NOT EXISTS public.supabase_heartbeat (
    id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);
INSERT INTO public.supabase_heartbeat (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- =====================================
-- (OPCIONAL) PROJETO EM PRODUÇÃO: SEGURANÇA E ROW LEVEL SECURITY (RLS)
-- =====================================
-- Por padrão, para facilitar o desenvolvimento local com a anon_key, o RLS está desabilitado nas tabelas.
-- O próprio servidor Express (`server.ts`) atua como gateway de segurança, validando as ações do admin com o PIN correspondente.
-- Se desejar habilitar segurança RLS direta no banco, remova o comentário do bloco abaixo:

-- ALTER TABLE public.wedding_info ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- DROP POLICY IF EXISTS "Permitir leitura pública de wedding_info" ON public.wedding_info;
-- CREATE POLICY "Permitir leitura pública de wedding_info" ON public.wedding_info FOR SELECT USING (true);
-- DROP POLICY IF EXISTS "Permitir modificação apenas por admin role" ON public.wedding_info;
-- CREATE POLICY "Permitir modificação apenas por admin role" ON public.wedding_info FOR ALL TO service_role USING (true) WITH CHECK (true);

-- DROP POLICY IF EXISTS "Permitir leitura pública de gifts" ON public.gifts;
-- CREATE POLICY "Permitir leitura pública de gifts" ON public.gifts FOR SELECT USING (true);
-- DROP POLICY IF EXISTS "Permitir compra pública de presente" ON public.gifts;
-- CREATE POLICY "Permitir compra pública de presente" ON public.gifts FOR UPDATE USING (true) WITH CHECK (true);
-- DROP POLICY IF EXISTS "Permitir gerenciamento de presentes pela service_role" ON public.gifts;
-- CREATE POLICY "Permitir gerenciamento de presentes pela service_role" ON public.gifts FOR ALL TO service_role USING (true) WITH CHECK (true);

-- DROP POLICY IF EXISTS "Permitir inserção pública de RSVP" ON public.rsvps;
-- CREATE POLICY "Permitir inserção pública de RSVP" ON public.rsvps FOR INSERT WITH CHECK (true);
-- DROP POLICY IF EXISTS "Permitir leitura publica de rsvps" ON public.rsvps;
-- CREATE POLICY "Permitir leitura publica de rsvps" ON public.rsvps FOR SELECT USING (true);
-- DROP POLICY IF EXISTS "Permitir gerenciamento total de RSVPs pela service_role" ON public.rsvps;
-- CREATE POLICY "Permitir gerenciamento total de RSVPs pela service_role" ON public.rsvps FOR ALL TO service_role USING (true) WITH CHECK (true);

-- DROP POLICY IF EXISTS "Permitir criação pública de compras" ON public.purchases;
-- CREATE POLICY "Permitir criação pública de compras" ON public.purchases FOR INSERT WITH CHECK (true);
-- DROP POLICY IF EXISTS "Permitir leitura pública de compras" ON public.purchases;
-- CREATE POLICY "Permitir leitura pública de compras" ON public.purchases FOR SELECT USING (true);
-- DROP POLICY IF EXISTS "Permitir gerenciamento de compras pela service_role" ON public.purchases;
-- CREATE POLICY "Permitir gerenciamento de compras pela service_role" ON public.purchases FOR ALL TO service_role USING (true) WITH CHECK (true);

-- DROP POLICY IF EXISTS "Acesso total a notificações pela service_role" ON public.notifications;
-- CREATE POLICY "Acesso total a notificações pela service_role" ON public.notifications FOR ALL TO service_role USING (true) WITH CHECK (true);

