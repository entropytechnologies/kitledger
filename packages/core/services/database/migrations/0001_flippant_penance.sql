-- Custom SQL migration file, put your code below! ---- Custom SQL migration file, put your code below!

-- Add a trigger to check if the UOM conversion rate is greater than or equal to zero
CREATE OR REPLACE FUNCTION kl_core_check_conversion_rate_negative_values() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.rate < 0 THEN
        RAISE EXCEPTION 'Rate must be greater than or equal to zero';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'kl_core_check_conversion_rate_negative_values_trigger'
        AND tgrelid = 'kl_core_conversion_rates'::regclass -- Check against the prefixed table
    ) THEN
        CREATE TRIGGER kl_core_check_conversion_rate_negative_values_trigger
        BEFORE INSERT OR UPDATE ON kl_core_conversion_rates -- Prefixed table name
        FOR EACH ROW
        EXECUTE PROCEDURE kl_core_check_conversion_rate_negative_values();
    END IF;
END;
$$;

-- Add a trigger to check if the value and quantity are greater than or equal to zero
CREATE OR REPLACE FUNCTION kl_core_check_entry_negative_values() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.value < 0 THEN
        RAISE EXCEPTION 'Value must be greater than or equal to zero';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'kl_core_check_entry_negative_values_trigger'
        AND tgrelid = 'kl_core_entries'::regclass -- Check against the prefixed table
    ) THEN
        CREATE TRIGGER kl_core_check_entry_negative_values_trigger
        BEFORE INSERT OR UPDATE ON kl_core_entries -- Prefixed table name
        FOR EACH ROW
        EXECUTE PROCEDURE kl_core_check_entry_negative_values();
    END IF;
END;
$$;

